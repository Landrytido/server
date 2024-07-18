import {Injectable, InternalServerErrorException, NotFoundException} from "@nestjs/common";
import {LinkGroupRepository} from "../../../Repository/LinkGroupRepository";
import {ContextualGraphqlRequest} from "../../../../index";
import {LinkGroup} from "../../../Entity/LinkGroup";



@Injectable()
export class GetAllLinkGroupsUseCase {
    constructor(private readonly linkGroupRepository: LinkGroupRepository) {}

    async handle(context: ContextualGraphqlRequest): Promise<LinkGroup[]>{
        try {
            const linkGroups = await this.linkGroupRepository.findAll();
            if (!linkGroups || linkGroups.length === 0) {
                throw new NotFoundException(`No link groups found`);
            }
            return linkGroups;
        } catch (error) {
            console.error('Error fetching link groups:', error);
            throw new InternalServerErrorException('Failed to fetch link groups');
        }
    }
}
