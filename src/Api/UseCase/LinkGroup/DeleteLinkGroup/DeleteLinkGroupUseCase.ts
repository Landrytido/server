import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import LinkGroupRepository from "../../../Repository/LinkGroupRepository";
import { ContextualGraphqlRequest, UseCase } from "../../../../index";
import LinkGroup from "../../../Entity/LinkGroup";
import InsufficientPermissionException from "../../../../Core/Exception/InsufficientPermissionException";

@Injectable()
export default class DeleteLinkGroupUseCase
  implements UseCase<Promise<LinkGroup>, [LinkGroupId: number]>
{
  constructor(private readonly linkGroupRepository: LinkGroupRepository) {}

  async handle(
    context: ContextualGraphqlRequest,
    linkGroupId: number,
  ): Promise<LinkGroup> {
    try {
      const linkGroup = await this.linkGroupRepository.findById(linkGroupId);

      if (!linkGroup)
        throw new NotFoundException(
          `LinkGroup with ID ${linkGroupId} not found`,
        );

      if (linkGroup.userId !== context.userId)
        throw new InsufficientPermissionException(
          "Access denied: User with ID ${context.userId} cannot modify link group owned by user with ID ${linkGroup.userId}.",
        );

      return await this.linkGroupRepository.delete(linkGroupId);
    } catch (error) {
      throw new BadRequestException(
        "Failed to delete link group",
        error.message,
      );
    }
  }
}
