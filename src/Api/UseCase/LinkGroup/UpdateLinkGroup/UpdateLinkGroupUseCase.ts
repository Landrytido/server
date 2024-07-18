import {BadRequestException, Injectable} from "@nestjs/common";
import {LinkGroupRepository} from "../../../Repository/LinkGroupRepository";
import {UpdateLinkGroupDto} from "./UpdateLinkGroupDto";
import {LinkGroup} from "../../../Entity/LinkGroup";
import {ContextualGraphqlRequest} from "../../../../index";

@Injectable()
export class UpdateLinkGroupUseCase {
    constructor(private readonly linkGroupRepository: LinkGroupRepository) {}

    async handle(context:ContextualGraphqlRequest,  linkGroupId: number, dto: UpdateLinkGroupDto): Promise<LinkGroup> {
        try {
            return await this.linkGroupRepository.update(linkGroupId, context.userId, dto);
        } catch (error) {
            throw new BadRequestException('Failed to update link group', error.message);
        }
    }
}