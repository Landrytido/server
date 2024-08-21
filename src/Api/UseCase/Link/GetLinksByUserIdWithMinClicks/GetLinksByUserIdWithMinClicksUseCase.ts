import { Injectable } from "@nestjs/common";
import LinkRepository from "../../../Repository/LinkRepository";
import { ContextualGraphqlRequest } from "../../../../index";

@Injectable()
export default class GetLinksByUserIdWithMinClicksUseCase {
  constructor(private readonly linkRepository: LinkRepository) {}

  async handle(context: ContextualGraphqlRequest, minClicks: number) {
    return this.linkRepository.findLinksByUserIdWithMinClicks(
      context.userId,
      minClicks,
    );
  }
}
