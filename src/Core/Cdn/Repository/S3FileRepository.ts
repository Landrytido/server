import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileUpload } from 'graphql-upload';
import UniqidGenerator from '../../Helper/UniqidGenerator';
import UploadFileDto from '../UseCase/UploadFile/UploadFileDto';
import NoSuchFilenameException from './exceptions/NoSuchFilenameException';

export interface UploadedFile {
  path: string;
  filename: string;
  initialFilename: string;
  uri: string;
}

@Injectable()
export default class S3FileRepository {
  constructor(private readonly uniqidGenerator: UniqidGenerator, private readonly configService: ConfigService) {}

  async create(dto: UploadFileDto): Promise<any> {
    if (!dto.file.filename || dto.file.filename === '') {
      throw new NoSuchFilenameException();
    }

    const upload = await this.createUpload(dto);

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

    return this.makePublicUrl(upload);
  }

  private async createUpload(dto: UploadFileDto) {
    return {
      Bucket: dto.path,
      Key: `${this.uniqidGenerator.generate()}.${this.extractExtensionFromFilename(dto.file)}`,
      Body: (dto.file as any).buffer,
      ContentType: dto.file.mimetype,
      chunks: [],
    };
  }

  private extractExtensionFromFilename(file: FileUpload) {
    return file.filename.split('.').pop();
  }

  private makePublicUrl(upload: any) {
    return `${this.configService.get('CDN_PUBLIC_URL')}/${upload.Bucket}/${upload.Key}`;
  }
}
