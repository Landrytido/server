// src/UseCase/Link/CreateLinkFromLinkGroupUseCase.ts
import {Injectable} from '@nestjs/common';
import {ContextualGraphqlRequest, UseCase} from '../../../../../index';
import {SaveLinkDto} from '../../../../Dto/LinkDto/SaveLinkDto';
import LinkRepository from '../../../../Repository/Link/LinkRepository';
import LinkGroupLinkRepository from '../../../../Repository/Link/LinkGroupLinkRepository';

@Injectable()
export default class CreateLinkFromLinkGroupUseCase implements UseCase<Promise<any>, [dto: SaveLinkDto]> {
    constructor(
        private readonly linkRepository: LinkRepository,
        private readonly linkGroupLinkRepository: LinkGroupLinkRepository,
    ) {
    }

    async handle(context: ContextualGraphqlRequest, dto: SaveLinkDto): Promise<any> {
        dto.ownerId = context.userId;
        // Check if a Link with the same URL already exists.
        let link = await this.linkRepository.findByUrl(dto.url);
        if (link) {
            // Ensure the join relation does not already exist.
            const existingRelation = await this.linkGroupLinkRepository.find(dto.linkGroupId, link.id);
            if (!existingRelation) {
                await this.linkGroupLinkRepository.create(dto.linkGroupId, link.id, dto.linkName);
            }else {
                // Update the existing relation name.
                await this.linkGroupLinkRepository.updateLinkName(dto.linkGroupId, link.id, dto.linkName);
            }
        } else {
            // Create a new Link and then create the join relation.
            link = await this.linkRepository.create(dto);
            await this.linkGroupLinkRepository.create(dto.linkGroupId, link.id, dto.linkName);
        }
        return link;
    }
}
