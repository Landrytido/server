import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import LinkRepository from "../../../Repository/LinkRepository";
import { Link } from "@prisma/client";
import { ContextualGraphqlRequest, UseCase } from "../../../../index";
import UpdateLinkDto from "./UpdateLinkDto";
import InsufficientPermissionException from "../../../../Core/Exception/InsufficientPermissionException";

@Injectable()
export default class UpdateLinkUseCase
  implements UseCase<Promise<Link>, [id: number, dto: UpdateLinkDto]>
{
  constructor(private readonly linkRepository: LinkRepository) {}

  async handle(
    context: ContextualGraphqlRequest,
    id: number,
    dto: UpdateLinkDto,
  ): Promise<Link> {
    try {
      const link = await this.linkRepository.findById(id);

      if (!link) throw new NotFoundException(`Link with id ${id} not found`);

      if (link.userId !== context.userId)
        throw new InsufficientPermissionException(
          "You do not have permission to access or modify this link.",
        );

      return await this.linkRepository.save(context.userId, {
        id: id,
        ...dto,
      });
    } catch (error) {
      throw new BadRequestException("Failed to update link", error.message);
    }
  }
}
