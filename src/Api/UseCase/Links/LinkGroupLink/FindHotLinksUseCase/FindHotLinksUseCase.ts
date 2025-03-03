// src/Api/UseCase/Links/LinkGroupLink/FindHotLinksUseCase/FindHotLinksUseCase.ts
import { Injectable } from '@nestjs/common';
import LinkGroupLinkRepository from "../../../../Repository/Link/LinkGroupLinkRepository";
import {ContextualGraphqlRequest, UseCase} from "../../../../../index";
import {LinkGroupLink} from "@prisma/client";

@Injectable()
export default class FindHotLinksUseCase implements UseCase<Promise<LinkGroupLink[]>, [limit: number]> {
    constructor(private readonly linkGroupLinkRepository: LinkGroupLinkRepository) {}

    async handle(context: ContextualGraphqlRequest, limit: number): Promise<LinkGroupLink[]> {
        return await this.linkGroupLinkRepository.findHotLinks(context.userId, limit);
    }
}
