import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Link } from "@prisma/client";
import LinkRepository from "../../../Repository/LinkRepository";
import { ContextualGraphqlRequest, UseCase } from "../../../../index";

@Injectable()
export default class GetLinkByIdUseCase
  implements UseCase<Promise<Link>, [id: number]>
{
  constructor(private readonly linkRepository: LinkRepository) {}

  async handle(context: ContextualGraphqlRequest, id: number) {
    try {
      const link = await this.linkRepository.findById(id);
      if (!link) {
        throw new NotFoundException(`Link with ID ${id} not found`);
      }
      return link;
    } catch (error) {
      throw new BadRequestException("Failed to find link", error.message);
    }
  }
}
