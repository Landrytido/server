import { ForbiddenException, Injectable } from "@nestjs/common";
import { File } from "@prisma/client";
import { ContextualGraphqlRequest, UseCase } from "src";
import FileRepository from "src/Api/Repository/FileRepository";
import FileDto from "../FileDto";

@Injectable()
export default class SaveFileUseCase
    implements UseCase<Promise<File>, [dto: FileDto]>
{
    constructor(private readonly fileRepository: FileRepository) {}

    async handle(
        context: ContextualGraphqlRequest,
        dto: FileDto
    ): Promise<File> {
        try {
            if (!context.userId) {
                throw new ForbiddenException("Not authorized");
            }
            return await this.fileRepository.saveFile(dto);
        } catch (error) {
            throw new ForbiddenException(error.message);
        }
    }
}
