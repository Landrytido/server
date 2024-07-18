import {BadRequestException, Injectable} from "@nestjs/common";
import {LinkGroupRepository} from "../../../Repository/LinkGroupRepository";
import {LinkGroup} from "../../../Entity/LinkGroup";
import {ContextualGraphqlRequest} from "../../../../index";

@Injectable()
export class GetLinkGroupsByUserIdUseCase {
    constructor(private readonly linkGroupRepository: LinkGroupRepository) {}

    async handle(context:ContextualGraphqlRequest, userId: number): Promise<LinkGroup[]> {
        try {
            return await this.linkGroupRepository.findByUserId(userId);
        } catch (error) {
            throw new BadRequestException('Failed to find link groups by user ID', error.message);
        }
    }
}