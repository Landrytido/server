import { Injectable, BadRequestException } from "@nestjs/common";
import LinkClickRepository from "../../../Repository/LinkClickRepository";
import { ContextualGraphqlRequest, UseCase } from "../../../../index";
import SaveLinkClickDto from "./SaveLinkClickDto";
import LinkClick from "src/Api/Entity/LinkClick";

@Injectable()
export default class SaveLinkClickUseCase
  implements UseCase<Promise<LinkClick>, [dto: SaveLinkClickDto]>
{
  constructor(private readonly linkClickRepository: LinkClickRepository) {}

  async handle(context: ContextualGraphqlRequest, dto: SaveLinkClickDto) {
    try {
      return await this.linkClickRepository.saveClicks(dto.linkId, dto.userId);
    } catch (error) {
      throw new BadRequestException(
        "Failed to create link click",
        error.message
      );
    }
  }
}
