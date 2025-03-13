// src/UseCase/Link/DeleteLinkGroupUseCase.ts
import { Injectable } from '@nestjs/common';
import { LinkGroup } from '@prisma/client';
import {ContextualGraphqlRequest, UseCase} from "../../../../../index";
import LinkGroupRepository from "../../../../Repository/Link/LinkGroupRepository";

@Injectable()
export default class DeleteLinkGroupUseCase implements UseCase<Promise<LinkGroup>, [id: string]> {
    constructor(private readonly linkGroupRepository: LinkGroupRepository) {}

    async handle(context: ContextualGraphqlRequest, id: string): Promise<LinkGroup> {
	  return this.linkGroupRepository.delete(id);
    }
}
