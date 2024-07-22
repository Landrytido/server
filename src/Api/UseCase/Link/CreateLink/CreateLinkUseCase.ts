import {BadRequestException, Injectable} from "@nestjs/common";
import {LinkRepository} from "../../../Repository/LinkRepository";
import {CreateLinkDto} from "./CreateLinkDto";
import {Link} from "@prisma/client";
import {ContextualGraphqlRequest} from "../../../../index";

@Injectable()
export class CreateLinkUseCase {
    constructor(private readonly linkRepository: LinkRepository) {}

    async handle( context: ContextualGraphqlRequest, dto: CreateLinkDto): Promise<Link> {
        try {
            return await this.linkRepository.create(context.userId, dto);
        } catch (error) {
            throw new BadRequestException('Failed to create link', error.message);
        }
    }
}
