import { BadRequestException, Injectable } from "@nestjs/common";
import { LinkGroup } from "../../../Entity/LinkGroup";
import LinkGroupRepository from "../../../Repository/LinkGroupRepository";
import { ContextualGraphqlRequest, UseCase } from "../../../../index";
import CreateLinkGroupDto from "./CreateLinkGroupDto";

@Injectable()
export default class CreateLinkGroupUseCase implements UseCase<Promise<LinkGroup>, [dto: CreateLinkGroupDto]> {
    constructor(private readonly linkGroupRepository: LinkGroupRepository) {}

    async handle(context: ContextualGraphqlRequest, dto: CreateLinkGroupDto): Promise<LinkGroup> {
        try {
            return await this.linkGroupRepository.save(context.userId, dto);
        } catch (error) {
            throw new BadRequestException('Failed to create Link group', error.message);
        }
    }
}