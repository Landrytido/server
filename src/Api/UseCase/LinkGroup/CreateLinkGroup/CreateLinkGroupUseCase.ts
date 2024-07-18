import {BadRequestException, Injectable} from "@nestjs/common";
import {CreateLinkGroupDto} from "./CreateLinkGroupDto";
import {LinkGroup} from "../../../Entity/LinkGroup";
import {LinkGroupRepository} from "../../../Repository/LinkGroupRepository";
import {ContextualGraphqlRequest, UseCase} from "../../../../index";


@Injectable()
export class CreateLinkGroupUseCase implements UseCase<Promise<LinkGroup>, [dto: CreateLinkGroupDto]> {
    constructor(private readonly linkGroupRepository: LinkGroupRepository) {}

    async handle(context: ContextualGraphqlRequest, dto: CreateLinkGroupDto): Promise<LinkGroup> {
        try {
            return await this.linkGroupRepository.create(context.userId, dto);
        } catch (error) {
            throw new BadRequestException('Failed to create Link group', error.message);
        }
    }
}