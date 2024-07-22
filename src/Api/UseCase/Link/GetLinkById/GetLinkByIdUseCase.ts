import {BadRequestException, Injectable, NotFoundException} from "@nestjs/common";
import {Link} from "@prisma/client";
import {LinkRepository} from "../../../Repository/LinkRepository";
import {ContextualGraphqlRequest} from "../../../../index";

@Injectable()
export class GetLinkByIdUseCase {
    constructor(private readonly linkRepository: LinkRepository) {}

    async handle( context: ContextualGraphqlRequest, id:number): Promise<Link> {
        try {
            const link = await this.linkRepository.findById(id);
            if (!link) {
                throw new NotFoundException(`Link with ID ${id} not found`);
            }
            return link;
        } catch (error) {
            throw new BadRequestException('Failed to find link', error.message);
        }
    }
}