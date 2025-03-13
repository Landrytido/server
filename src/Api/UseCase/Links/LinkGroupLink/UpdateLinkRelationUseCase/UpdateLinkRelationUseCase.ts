// src/UseCase/Link/UpdateLinkRelationUseCase.ts
import {Injectable} from '@nestjs/common';
import {LinkGroupLink} from '@prisma/client';
import {ContextualGraphqlRequest, UseCase} from "../../../../../index";
import {SaveLinkDto} from "../../../../Dto/LinkDto/SaveLinkDto";
import LinkRepository from "../../../../Repository/Link/LinkRepository";
import LinkGroupLinkRepository from "../../../../Repository/Link/LinkGroupLinkRepository";

@Injectable()
export default class UpdateLinkRelationUseCase implements UseCase<Promise<LinkGroupLink>, [dto: SaveLinkDto]> {
    constructor(
        private readonly linkRepository: LinkRepository,
        private readonly linkGroupLinkRepository: LinkGroupLinkRepository,
    ) {
    }

    async handle(context: ContextualGraphqlRequest, dto: SaveLinkDto): Promise<LinkGroupLink> {
        dto.ownerId = context.userId;
        if (!dto.id) {
            throw new Error('Existing link id is required for update.');
        }

        // Retrieve the existing (old) link.
        const oldLink = await this.linkRepository.findById(dto.id);
        if (!oldLink) {
            throw new Error(`Link with id ${dto.id} not found`);
        }

        // If the URL is unchanged, update the relation name and return the join record.
        if (oldLink.url === dto.url) {
            const updatedRelation = await this.linkGroupLinkRepository.updateLinkName(
                dto.linkGroupId,
                dto.id,
                dto.linkName
            );
            return updatedRelation;
        } else {
            // URL has changed.
            // Check if a Link with the new URL already exists.
            let newLink = await this.linkRepository.findByUrl(dto.url);
            if (!newLink) {
                // Create a new Link if it does not exist.
                newLink = await this.linkRepository.create(dto);
            }
            // Delete the old join relation (using deleteMany so that error is not thrown if record is missing).
            await this.linkGroupLinkRepository.delete(dto.linkGroupId, dto.id);
            // Create a new join relation with the new link id and updated relation name.
            const newRelation = await this.linkGroupLinkRepository.create(
                dto.linkGroupId,
                newLink.id,
                dto.linkName
            );
            // Clean up the old link if it is no longer referenced by any group.
            await this.linkRepository.deleteIfOrphan(dto.id);
            return newRelation;
        }
    }
}
