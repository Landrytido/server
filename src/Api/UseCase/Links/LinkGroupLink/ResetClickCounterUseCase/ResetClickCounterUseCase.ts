// src/UseCase/Link/ResetClickCounterUseCase.ts
import { Injectable } from '@nestjs/common';
import {ContextualGraphqlRequest, UseCase} from "../../../../../index";
import LinkGroupLinkRepository from "../../../../Repository/Link/LinkGroupLinkRepository";
import {LinkGroupLink} from "@prisma/client";

@Injectable()
export default class ResetClickCounterUseCase implements UseCase<Promise<LinkGroupLink>, [linkGroupId: string, linkId: string]> {
    constructor(private readonly linkGroupLinkRepository: LinkGroupLinkRepository) {}

    async handle(context: ContextualGraphqlRequest, linkGroupId: string, linkId: string): Promise<LinkGroupLink> {
	  return this.linkGroupLinkRepository.resetClickCounter(linkGroupId, linkId);
    }
}
