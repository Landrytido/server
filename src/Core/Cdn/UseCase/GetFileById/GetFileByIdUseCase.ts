import { BadRequestException, Injectable } from '@nestjs/common';
import RequestEventEmitter from '../../../Event/Emitter/RequestEventEmitter';
import { ContextualGraphqlRequest, UseCase } from '../../../../index';
import FileEntity from '../../Entity/FileEntity';
import PrismaFileRepository from '../../Repository/PrismaFileRepository';

@Injectable()
export default class GetFileByIdUseCase implements UseCase<Promise<FileEntity|null>, [id: number]> {
  constructor(
    private readonly eventEmitter: RequestEventEmitter,
    private readonly prismaFileRepository: PrismaFileRepository
  ) {}

  async handle(context: ContextualGraphqlRequest, id: number) {
    try {
      const file = await this.prismaFileRepository.findById(id);

      this.eventEmitter.emit('get_file_by_id_successfully', { context, id });

      return file;
    } catch (error) {
      this.eventEmitter.emit('get_file_by_id_failed', { context, id, error: error.message });

      throw new BadRequestException(error.message);
    }
  }
}
