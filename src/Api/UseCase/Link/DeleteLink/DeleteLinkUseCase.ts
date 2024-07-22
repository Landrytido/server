import {ContextualGraphqlRequest} from "../../../../index";
import {LinkRepository} from "../../../Repository/LinkRepository";
import {Link} from "@prisma/client";
import {BadRequestException, Injectable} from "@nestjs/common";

@Injectable()
export class DeleteLinkUseCase {
    constructor(private readonly linkRepository: LinkRepository) {}

    async handle(context: ContextualGraphqlRequest, id: number): Promise<Link> {
        try {
            return await this.linkRepository.delete(id, context.userId);
        } catch (error) {
            throw new BadRequestException('Failed to delete link', error.message);
        }
    }
}