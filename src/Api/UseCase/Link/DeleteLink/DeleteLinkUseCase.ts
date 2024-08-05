import { ContextualGraphqlRequest, UseCase } from "../../../../index";
import LinkRepository from "../../../Repository/LinkRepository";
import { Link } from "@prisma/client";
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import InsufficientPermissionException from "../../../../Core/Exception/InsufficientPermissionException";

@Injectable()
export default class DeleteLinkUseCase
  implements UseCase<Promise<Link>, [id: number]>
{
  constructor(private readonly linkRepository: LinkRepository) {}

  async handle(context: ContextualGraphqlRequest, id: number) {
    try {
      const link = await this.linkRepository.findById(id);

      if (!link)
        throw new NotFoundException("Failed to find link with id " + id);

      if (link.userId !== context.userId)
        throw new InsufficientPermissionException(
          `Access denied: User with ID ${context.userId} cannot modify link owned by user with ID ${link.userId}.`,
        );

      return await this.linkRepository.delete(id);
    } catch (error) {
      throw new BadRequestException("Failed to delete link", error.message);
    }
  }
}
