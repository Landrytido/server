import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { ContextualGraphqlRequest, UseCase } from "../../../../index";
import { LinkClick } from "@prisma/client";
import LinkClickRepository from "../../../Repository/LinkClickRepository";

@Injectable()
export default class GetLinkClickByIdUseCase
  implements UseCase<Promise<LinkClick>, [id: number]>
{
  constructor(private readonly linkClickRepository: LinkClickRepository) {}

  async handle(context: ContextualGraphqlRequest, id: number) {
    try {
      const linkClick = await this.linkClickRepository.findById(id);
      if (!linkClick) {
        throw new NotFoundException(`Link click with ID ${id} not found`);
      }
      return linkClick;
    } catch (error) {
      throw new BadRequestException("Failed to find link click", error.message);
    }
  }
}
