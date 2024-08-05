import { Injectable, InternalServerErrorException } from "@nestjs/common";
import LinkGroupRepository from "../../../Repository/LinkGroupRepository";
import { ContextualGraphqlRequest, UseCase } from "../../../../index";
import LinkGroup from "../../../Entity/LinkGroup";

@Injectable()
export default class GetAllLinkGroupsUseCase
  implements UseCase<Promise<LinkGroup[]>, []>
{
  constructor(private readonly linkGroupRepository: LinkGroupRepository) {}

  async handle(context: ContextualGraphqlRequest): Promise<LinkGroup[]> {
    try {
      return await this.linkGroupRepository.findAll();
    } catch (error) {
      throw new InternalServerErrorException(
        "Failed to fetch link groups",
        error.message,
      );
    }
  }
}
