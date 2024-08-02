import { BadRequestException, Injectable } from "@nestjs/common";
import { Link } from "@prisma/client";
import { LinkRepository } from "../../../Repository/LinkRepository";
import { ContextualGraphqlRequest, UseCase } from "../../../../index";

@Injectable()
export default class GetLinksByLinkGroupIdUseCase implements UseCase<Promise<Link[]>, [linkGroupId:number]> {
    constructor(private readonly linkRepository: LinkRepository) {}

    async handle(context: ContextualGraphqlRequest,linkGroupId: number): Promise<Link[]> {
        try {
            return await this.linkRepository.findByLinkGroupId(linkGroupId);
        } catch (error) {
            throw new BadRequestException('Failed to find links in this group of links', error.message);
        }
    }
}