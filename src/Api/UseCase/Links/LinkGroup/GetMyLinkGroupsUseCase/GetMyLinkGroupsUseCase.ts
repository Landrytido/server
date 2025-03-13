// src/UseCase/Link/GetMyLinkGroupsUseCase.ts
import { Injectable } from '@nestjs/common';
import { LinkGroup } from '@prisma/client';
import {ContextualGraphqlRequest, UseCase} from "../../../../../index";
import LinkGroupRepository from "../../../../Repository/Link/LinkGroupRepository";

@Injectable()
export default class GetMyLinkGroupsUseCase implements UseCase<Promise<LinkGroup[]>, []> {
    constructor(private readonly linkGroupRepository: LinkGroupRepository) {}

    async handle(context: ContextualGraphqlRequest): Promise<LinkGroup[]> {
	  return this.linkGroupRepository.findByUserId(context.userId);
    }
}
