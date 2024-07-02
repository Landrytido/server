import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { ContextualRequest } from '../../Decorator/ContextualRequest';
import GraphqlAuthGuard from '../../Security/Guard/GraphqlAuthGuard';
import { ContextualGraphqlRequest } from '../../../index';
import FileEntity from '../Entity/FileEntity';
import FileUseCaseFactory from '../UseCase/FileUseCaseFactory';
import UploadFileUseCase from '../UseCase/UploadFile/UploadFileUseCase';

@Resolver(FileEntity)
export default class FileResolver {
  constructor(private readonly serviceFactory: FileUseCaseFactory) {}

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => FileEntity)
  async uploadFile(
    @ContextualRequest() context: ContextualGraphqlRequest,
    @Args({ name: 'file', type: () => GraphQLUpload }) file: FileUpload,
    @Args({ name: 'path', type: () => String }) path: string
  ) {
    return (await this.serviceFactory.create(UploadFileUseCase)).handle(context, { path, file });
  }
}
