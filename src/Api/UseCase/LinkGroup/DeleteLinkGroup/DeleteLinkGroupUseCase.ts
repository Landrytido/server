import {BadRequestException, Injectable} from "@nestjs/common";
import {LinkGroupRepository} from "../../../Repository/LinkGroupRepository";
import {ContextualGraphqlRequest} from "../../../../index";
import {LinkGroup} from "../../../Entity/LinkGroup";

@Injectable()
export class DeleteLinkGroupUseCase {
    constructor(private readonly linkGroupRepository: LinkGroupRepository) {}

    async handle(context: ContextualGraphqlRequest, linkGroupId: number): Promise<LinkGroup> {
        try {
            return await this.linkGroupRepository.delete(linkGroupId, context.userId);
        } catch (error) {
            throw new BadRequestException('Failed to delete link group', error.message);
        }
    }
}