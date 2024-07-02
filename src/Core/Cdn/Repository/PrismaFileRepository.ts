import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../Datasource/Prisma';
import { UploadedFile } from './S3FileRepository';

@Injectable()
export default class PrismaFileRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: number) {
    return this.prisma.file.findUnique({ where: { id } });
  }

  async create(file: UploadedFile) {
    return this.prisma.file.create({
      data: {
        uri: file.uri,
        filename: file.filename,
        initialFilename: file.initialFilename,
        path: file.path
      }
    });
  }
}
