import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { LinkGroupRepository } from "../../../Repository/LinkGroupRepository";
import {ContextualGraphqlRequest, UseCase} from "../../../../index";
import { LinkGroup } from "../../../Entity/LinkGroup";

@Injectable()
export default class GetAllLinkGroupsUseCase implements UseCase<Promise<LinkGroup[]>, []>{
    constructor(private readonly linkGroupRepository: LinkGroupRepository) {}

    async handle(context: ContextualGraphqlRequest): Promise<LinkGroup[]>{
        try {
            const linkGroups = await this.linkGroupRepository.findAll();
            if (!linkGroups || linkGroups.length === 0) {
                throw new NotFoundException(`No link groups found`);
            }
            return linkGroups.map(group =>({
                ...group,
                links: group.links || [],
            }));
        } catch (error) {
            console.error('Error fetching link groups:', error);
            throw new InternalServerErrorException('Failed to fetch link groups');
        }
    }
}
