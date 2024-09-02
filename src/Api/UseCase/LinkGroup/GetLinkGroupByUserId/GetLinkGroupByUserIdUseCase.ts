import { BadRequestException, Injectable } from "@nestjs/common";
import LinkGroupRepository from "../../../Repository/LinkGroupRepository";
import { ContextualGraphqlRequest, UseCase } from "../../../../index";
import { LinkGroup } from "@prisma/client";

@Injectable()
export default class GetLinkGroupsByUserIdUseCase
  implements UseCase<Promise<LinkGroup[]>, []>
{
  constructor(private readonly linkGroupRepository: LinkGroupRepository) {}

  async handle(context: ContextualGraphqlRequest): Promise<LinkGroup[]> {
    try {
      return await this.linkGroupRepository.findByUserId(context.userId);
    } catch (error) {
      throw new BadRequestException(
        "Failed to find link groups by user ID",
        error.message
      );
    }
  }
}
