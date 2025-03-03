// src/UseCase/Link/SaveLinkGroupUseCase.ts
import { Injectable } from '@nestjs/common';
import { LinkGroup } from '@prisma/client';
import {ContextualGraphqlRequest, UseCase} from "../../../../../index";
import {SaveLinkGroupDto} from "../../../../Dto/LinkDto/SaveLinkGroupDto";
import LinkGroupRepository from "../../../../Repository/Link/LinkGroupRepository";

@Injectable()
export default class SaveLinkGroupUseCase implements UseCase<Promise<LinkGroup>, [dto: SaveLinkGroupDto]> {
    constructor(private readonly linkGroupRepository: LinkGroupRepository) {}

    async handle(context: ContextualGraphqlRequest, dto: SaveLinkGroupDto): Promise<LinkGroup> {
	  return this.linkGroupRepository.save(context.userId, dto);
    }
}
