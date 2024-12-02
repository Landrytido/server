import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { ContextualRequest } from "src/Core/Decorator/ContextualRequest";
import UseCaseFactory from "../UseCase/UseCaseFactory";
import { ContextualGraphqlRequest } from "src";
import SaveFileUseCase from "../UseCase/File/SaveFile/SaveFileUseCase";
import { File } from "../Entity/File";
import GraphqlAuthGuard from "src/Core/Security/Guard/GraphqlAuthGuard";
import { UseGuards } from "@nestjs/common";
import FileDto from "../UseCase/File/FileDto";

@Resolver(File)
@UseGuards(GraphqlAuthGuard)
export default class FileResolver {
    constructor(private readonly serviceFactory: UseCaseFactory) {}

    @Mutation(() => File)
    async saveFile(
        @ContextualRequest() context: ContextualGraphqlRequest,
        @Args("dto") dto: FileDto
    ) {
        return (await this.serviceFactory.create(SaveFileUseCase)).handle(context, dto);
    }
}
