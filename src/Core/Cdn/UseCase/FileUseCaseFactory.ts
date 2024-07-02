import { Injectable } from '@nestjs/common';
import ServiceFactory from '../../Factory/ServiceFactory';
import GetFileByIdUseCase from './GetFileById/GetFileByIdUseCase';
import UploadFileUseCase from './UploadFile/UploadFileUseCase';

type AvailableUseCase = UploadFileUseCase | GetFileByIdUseCase;

@Injectable()
export default class FileUseCaseFactory extends ServiceFactory<AvailableUseCase> {}
