import { Injectable } from "@nestjs/common";
import LinkRepository from "../../../Repository/LinkRepository";
import { ContextualGraphqlRequest } from "../../../../index";

@Injectable()
export default class ResetUserHotlinksUseCase {
  constructor(private readonly linkRepository: LinkRepository) {}

  async handle(context: ContextualGraphqlRequest) {
    return this.linkRepository.resetHotLinks(context.userId);
  }
}
