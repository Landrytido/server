// src/UseCase/Link/DeleteLinkFromGroupUseCase.ts
import { Injectable } from '@nestjs/common';
import {ContextualGraphqlRequest, UseCase} from "../../../../../index";
import LinkGroupLinkRepository from "../../../../Repository/Link/LinkGroupLinkRepository";
import LinkRepository from "../../../../Repository/Link/LinkRepository";

@Injectable()
export default class DeleteLinkFromGroupUseCase implements UseCase<Promise<void>, [linkGroupId: string, linkId: string]> {
    constructor(
	    private readonly linkGroupLinkRepository: LinkGroupLinkRepository,
	    private readonly linkRepository: LinkRepository,
    ) {}

    async handle(context: ContextualGraphqlRequest, linkGroupId: string, linkId: string): Promise<void> {
	  // Remove the join relation.
	  await this.linkGroupLinkRepository.delete(linkGroupId, linkId);
	  // Delete the Link if it is no longer used in any group.
	  await this.linkRepository.deleteIfOrphan(linkId);
    }
}
