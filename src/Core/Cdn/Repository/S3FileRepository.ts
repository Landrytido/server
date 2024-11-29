import { PutObjectCommand, S3Client, UploadPartCommand } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import UniqidGenerator from '../../Helper/UniqidGenerator';
import UploadFileDto from '../UseCase/UploadFile/UploadFileDto';
import NoSuchFilenameException from './exceptions/NoSuchFilenameException';
@Injectable()
export default class S3FileRepository {
  constructor(private readonly uniqidGenerator: UniqidGenerator, private readonly configService: ConfigService) {}
  async create(dto: UploadFileDto): Promise<Prisma.XOR<Prisma.FileCreateInput, Prisma.FileUncheckedCreateInput>> {
    if (!dto.file.originalname || dto.file.originalname === '') {
      throw new NoSuchFilenameException();
    }
    const filename = `${this.uniqidGenerator.generate()}.${this.extractExtensionFromFilename(dto.file)}`;
    const upload = {
      Bucket: 'assets',
      Key: `${dto.path !== '' ? `${dto.path.replace('/','')}/` : ''}${filename}`,
      Body: (dto.file as any).buffer,
      ContentType: dto.file.mimetype,
      chunks: [],
    };
    //@ts-ignore
    const client = new S3Client({
      credentials: {
        accessKeyId: process.env.CDN_ACCESS_KEY_ID,
        secretAccessKey: process.env.CDN_ACCESS_KEY,
      },
      region: 'fr-par',
      endpoint: process.env.CDN_PUBLIC_URL,
      forcePathStyle: true,
    });
    const params = {
      ...upload,
      ACL: 'public-read',
      ContentDisposition: 'inline',
    };
    const command = new PutObjectCommand(params as any);
    await client.send(command);
    return {
      path: '',
      filename,
      initialFilename: dto.file.originalname,
      uri: this.makePublicUrl(upload),
    };
  }
  private extractExtensionFromFilename(file: Express.Multer.File) {
    return file.originalname.split('.').pop();
  }
  private makePublicUrl(upload: any) {
    return `${this.configService.get('CDN_PUBLIC_URL')}/${upload.Bucket}/${upload.Key}`;
  }
}