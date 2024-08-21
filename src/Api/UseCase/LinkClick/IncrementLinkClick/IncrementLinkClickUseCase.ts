import { BadRequestException, Injectable } from "@nestjs/common";
import { ContextualGraphqlRequest, UseCase } from "../../../../index";
import { LinkClick } from "@prisma/client";
import LinkClickRepository from "../../../Repository/LinkClickRepository";

@Injectable()
export default class IncrementLinkClickUseCase
  implements UseCase<Promise<LinkClick>, [linkId: number]>
{
  constructor(private readonly linkClickRepository: LinkClickRepository) {}

  async handle(context: ContextualGraphqlRequest, linkId: number) {
    try {
      return await this.linkClickRepository.saveClicks(linkId);
    } catch (error) {
      throw new BadRequestException(
        "Failed to increment link click",
        error.message,
      );
    }
  }
}
