import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import LinkGroupRepository from "../../../Repository/LinkGroupRepository";
import { LinkGroup } from "../../../Entity/LinkGroup";
import { ContextualGraphqlRequest, UseCase } from "../../../../index";

@Injectable()
export default class GetLinkGroupByIdUseCase
  implements UseCase<Promise<LinkGroup>, [LinkGroupId: number]>
{
  constructor(private readonly linkGroupRepository: LinkGroupRepository) {}

  async handle(
    context: ContextualGraphqlRequest,
    linkGroupId: number,
  ): Promise<LinkGroup> {
    try {
      const linkGroup = await this.linkGroupRepository.findById(linkGroupId);
      if (!linkGroup) {
        throw new NotFoundException(
          `LinkGroup with ID ${linkGroupId} not found`,
        );
      }
      return linkGroup;
    } catch (error) {
      throw new BadRequestException("Failed to find link group", error.message);
    }
  }
}
