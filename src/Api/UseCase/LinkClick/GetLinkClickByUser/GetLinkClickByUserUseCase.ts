import { BadRequestException, Injectable } from "@nestjs/common";
import { ContextualGraphqlRequest, UseCase } from "../../../../index";
import { LinkClick } from "@prisma/client";
import LinkClickRepository from "../../../Repository/LinkClickRepository";

@Injectable()
export default class GetLinkClickByUserUseCase
  implements UseCase<Promise<LinkClick[]>, []>
{
  constructor(private readonly linkClickRepository: LinkClickRepository) {}

  async handle(context: ContextualGraphqlRequest): Promise<LinkClick[]> {
    try {
      return await this.linkClickRepository.findByUserId(context.userId);
    } catch (error) {
      throw new BadRequestException(
        "Failed to find link clicks for the user",
        error.message,
      );
    }
  }
}
