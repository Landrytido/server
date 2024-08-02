import {BadRequestException, Injectable} from "@nestjs/common";
import {LinkRepository} from "../../../Repository/LinkRepository";
import {Link} from "@prisma/client";
import {ContextualGraphqlRequest} from "../../../../index";

@Injectable()
export class GetLinksByUserIdUseCase {
    constructor(private readonly linkRepository: LinkRepository) {}

    async handle(context: ContextualGraphqlRequest): Promise<Link[]> {
        try {
            return await this.linkRepository.findByUserId(context.userId);
        } catch (error) {
            throw new BadRequestException('Failed to find links by user ID', error.message);
        }
    }
}