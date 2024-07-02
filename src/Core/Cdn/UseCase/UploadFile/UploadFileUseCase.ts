import { BadRequestException, Injectable } from '@nestjs/common';
import RequestEventEmitter from '../../../Event/Emitter/RequestEventEmitter';
import { ContextualGraphqlRequest, UseCase } from '../../../../index';
import UploadFileDto from './UploadFileDto';
import FileEntity from '../../Entity/FileEntity';
import PrismaFileRepository from '../../Repository/PrismaFileRepository';
import S3FileRepository from '../../Repository/S3FileRepository';

@Injectable()
export default class UploadFileUseCase implements UseCase<Promise<FileEntity>, [dto: UploadFileDto]> {
  constructor(
    private readonly eventEmitter: RequestEventEmitter,
    private readonly prismaFileRepository: PrismaFileRepository,
    private readonly s3FileRepository: S3FileRepository
  ) {}

  async handle(context: ContextualGraphqlRequest, dto: UploadFileDto) {
    try {
      const file = await this.prismaFileRepository.create(await this.s3FileRepository.create(dto));

      this.eventEmitter.emit('upload_file_successfully', { context, dto });

      return file;
    } catch (error) {
      this.eventEmitter.emit('upload_file_failed', { context, dto, error: error.message });

      throw new BadRequestException(error.message);
    }
  }
}
