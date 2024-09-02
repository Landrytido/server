import { BadRequestException, Injectable } from "@nestjs/common";
import LinkGroupRepository from "../../../Repository/LinkGroupRepository";
import { ContextualGraphqlRequest, UseCase } from "../../../../index";
import CreateLinkGroupDto from "./CreateLinkGroupDto";
import { LinkGroup } from "@prisma/client";

@Injectable()
export default class CreateLinkGroupUseCase
  implements UseCase<Promise<LinkGroup>, [dto: CreateLinkGroupDto]>
{
  constructor(private readonly linkGroupRepository: LinkGroupRepository) {}

  async handle(
    context: ContextualGraphqlRequest,
    dto: CreateLinkGroupDto
  ): Promise<LinkGroup> {
    try {
      return await this.linkGroupRepository.save(context.userId, dto);
    } catch (error) {
      throw new BadRequestException(
        "Failed to create Link group",
        error.message
      );
    }
  }
}
