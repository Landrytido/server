import { BadRequestException, Injectable } from "@nestjs/common";
import { LinkRepository } from "../../../Repository/LinkRepository";
import { CreateLinkDto } from "./CreateLinkDto";
import { Link } from "@prisma/client";
import { ContextualGraphqlRequest, UseCase } from "../../../../index";

@Injectable()
export default class CreateLinkUseCase implements UseCase<Promise<Link>, [dto: CreateLinkDto]> {
    constructor(private readonly linkRepository: LinkRepository) {}

    async handle(context: ContextualGraphqlRequest, dto: CreateLinkDto): Promise<Link> {
        try {
            return await this.linkRepository.save(context.userId, dto);
        } catch (error) {
            throw new BadRequestException('Failed to create link', error.message);
        }
    }
}
