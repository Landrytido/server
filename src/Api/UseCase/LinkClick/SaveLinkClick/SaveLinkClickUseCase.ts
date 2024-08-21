import { Injectable, BadRequestException } from "@nestjs/common";
import LinkClickRepository from "../../../Repository/LinkClickRepository";
import { LinkClick } from "@prisma/client";
import { ContextualGraphqlRequest, UseCase } from "../../../../index";
import SaveLinkClickDto from "./SaveLinkClickDto";

@Injectable()
export default class SaveLinkClickUseCase
  implements UseCase<Promise<LinkClick>, [dto: SaveLinkClickDto]>
{
  constructor(private readonly linkClickRepository: LinkClickRepository) {}

  async handle(context: ContextualGraphqlRequest, dto: SaveLinkClickDto) {
    try {
      return await this.linkClickRepository.saveClicks(dto.linkId);
    } catch (error) {
      throw new BadRequestException(
        "Failed to create link click",
        error.message,
      );
    }
  }
}
