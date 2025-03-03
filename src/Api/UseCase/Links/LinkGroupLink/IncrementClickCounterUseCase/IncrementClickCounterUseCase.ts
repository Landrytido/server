// src/UseCase/Link/IncrementClickCounterUseCase.ts
import { Injectable } from '@nestjs/common';
import LinkGroupLinkRepository from "../../../../Repository/Link/LinkGroupLinkRepository";
import {ContextualGraphqlRequest, UseCase} from "../../../../../index";
import {LinkGroupLink} from "@prisma/client";

@Injectable()
export default class IncrementClickCounterUseCase implements UseCase<Promise<LinkGroupLink>, [linkGroupId: string, linkId: string]> {
    constructor(private readonly linkGroupLinkRepository: LinkGroupLinkRepository) {}

    async handle(context: ContextualGraphqlRequest, linkGroupId: string, linkId: string): Promise<LinkGroupLink> {
	  return this.linkGroupLinkRepository.incrementClickCounter(linkGroupId, linkId);
    }
}
