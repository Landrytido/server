import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import DatasourceModule from '../Datasource/DatasourceModule';
import UniqidGenerator from '../Helper/UniqidGenerator';
import FileUploadController from './Controller/FileUploadController';
import PrismaFileRepository from './Repository/PrismaFileRepository';
import S3FileRepository from './Repository/S3FileRepository';
import FileUseCaseFactory from './UseCase/FileUseCaseFactory';
@Module({
  imports: [ ConfigModule, DatasourceModule ],
  exports: [ FileUseCaseFactory, PrismaFileRepository, S3FileRepository ],
  controllers: [FileUploadController],
  providers: [ FileUseCaseFactory, PrismaFileRepository, S3FileRepository, UniqidGenerator ]
})
export class CdnModule {}