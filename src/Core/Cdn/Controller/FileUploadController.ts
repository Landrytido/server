import { Body, Controller, Get, Post, Request, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import JwtAuthGuard from '../../Security/Guard/JwtGuard';
import FileUseCaseFactory from '../UseCase/FileUseCaseFactory';
import UploadFileUseCase from '../UseCase/UploadFile/UploadFileUseCase';

@Controller('/file/upload')
export default class FileUploadController {
    constructor(private readonly serviceFactory: FileUseCaseFactory) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@Request() req: any, @Body() body, @UploadedFile() file: Express.Multer.File) {
        if (!body.path || typeof body.path !== 'string') {
            body.path = '';
        }

        return await (await (this.serviceFactory.create(UploadFileUseCase))).handle(req.user, { ...body, file });
    }
}