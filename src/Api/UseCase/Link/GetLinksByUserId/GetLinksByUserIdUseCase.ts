import { BadRequestException, Injectable } from "@nestjs/common";
import LinkRepository from "../../../Repository/LinkRepository";
import { Link } from "@prisma/client";
import { ContextualGraphqlRequest, UseCase } from "../../../../index";

@Injectable()
export default class GetLinksByUserIdUseCase
  implements UseCase<Promise<Link[]>, []>
{
  constructor(private readonly linkRepository: LinkRepository) {}

  async handle(context: ContextualGraphqlRequest): Promise<Link[]> {
    try {
      return await this.linkRepository.findByUserId(context.userId);
    } catch (error) {
      throw new BadRequestException(
        "Failed to find links by user ID",
        error.message,
      );
    }
  }
}
