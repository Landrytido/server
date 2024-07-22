import {BadRequestException, Injectable} from "@nestjs/common";
import {LinkRepository} from "../../../Repository/LinkRepository";
import {UpdateLinkDto} from "./UpdateLinkDto";
import {Link} from "@prisma/client";
import {ContextualGraphqlRequest} from "../../../../index";


@Injectable()
export class UpdateLinkUseCase {
    constructor(private readonly linkRepository: LinkRepository) {}

    async handle(context:ContextualGraphqlRequest, id: number, dto: UpdateLinkDto): Promise<Link> {
        try {
            return await this.linkRepository.update(context.userId, id, dto);
        } catch (error) {
            throw new BadRequestException('Failed to update link', error.message);
        }
    }
}