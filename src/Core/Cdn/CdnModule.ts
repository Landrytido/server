import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import DatasourceModule from '../Datasource/DatasourceModule';
import PrismaFileRepository from './Repository/PrismaFileRepository';
import S3FileRepository from './Repository/S3FileRepository';
import FileResolver from './Resolver/FileResolver';
import FileUseCaseFactory from './UseCase/FileUseCaseFactory';

@Module({
  imports: [ ConfigModule, DatasourceModule ],
  exports: [ FileUseCaseFactory ],
  providers: [ FileResolver, FileUseCaseFactory, PrismaFileRepository, S3FileRepository ]
})
export class CdnModule {}
