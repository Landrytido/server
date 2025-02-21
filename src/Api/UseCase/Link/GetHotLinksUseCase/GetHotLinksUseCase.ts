import { BadRequestException, Injectable } from "@nestjs/common";
import LinkRepository from "../../../Repository/LinkRepository";
import { Link } from "@prisma/client";
import { ContextualGraphqlRequest, UseCase } from "../../../../index";

@Injectable()
export default class GetHotLinksUseCase
  implements UseCase<Promise<Link[]>, [limit: number]>
{
  constructor(private readonly linkRepository: LinkRepository) {}

  async handle(context: ContextualGraphqlRequest, limit: number) {
    try {
      return await this.linkRepository.findHotLinks(context.userId, limit);
    } catch (error) {
      throw new BadRequestException(
        "Failed to find links by user ID",
        error.message
      );
    }
  }
}
