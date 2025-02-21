import { Injectable } from "@nestjs/common";
import LinkRepository from "../../../Repository/LinkRepository";
import { ContextualGraphqlRequest, UseCase } from "../../../../index";
import { Link } from "@prisma/client";

@Injectable()
export default class IncrementLinkUseCase
  implements UseCase<Promise<Link>, [linkId: number]>
{
  constructor(private readonly linkRepository: LinkRepository) {}

  async handle(context: ContextualGraphqlRequest, linkId: number) {
    return await this.linkRepository.incrementLink(context.userId, linkId);
  }
}
