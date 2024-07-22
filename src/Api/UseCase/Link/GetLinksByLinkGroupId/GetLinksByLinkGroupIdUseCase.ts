import {BadRequestException, Injectable} from "@nestjs/common";
import {Link} from "@prisma/client";
import {LinkRepository} from "../../../Repository/LinkRepository";
import {ContextualGraphqlRequest} from "../../../../index";

@Injectable()
export class GetLinksByLinkGroupIdUseCase {
    constructor(private readonly linkRepository: LinkRepository) {}

    async handle(context: ContextualGraphqlRequest,linkGroupId: number): Promise<Link[]> {
        try {
            return await this.linkRepository.findByLinkGroupId(linkGroupId);
        } catch (error) {
            throw new BadRequestException('Failed to find links by link group ID', error.message);
        }
    }
}