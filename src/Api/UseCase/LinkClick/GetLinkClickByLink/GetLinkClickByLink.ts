import { BadRequestException, Injectable } from "@nestjs/common";
import { ContextualGraphqlRequest, UseCase } from "../../../../index";
import { LinkClick } from "@prisma/client";
import LinkClickRepository from "../../../Repository/LinkClickRepository";

@Injectable()
export default class GetLinkClickByLinkUseCase
  implements UseCase<Promise<LinkClick[]>, [linkId: number]>
{
  constructor(private readonly linkClickRepository: LinkClickRepository) {}

  async handle(context: ContextualGraphqlRequest, linkId: number) {
    try {
      return await this.linkClickRepository.findByLinkId(linkId);
    } catch (error) {
      throw new BadRequestException("Failed to find link click", error.message);
    }
  }
}
