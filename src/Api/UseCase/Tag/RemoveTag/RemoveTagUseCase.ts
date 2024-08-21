import { BadRequestException, Injectable } from "@nestjs/common";
import { Tag } from "@prisma/client";
import { ContextualGraphqlRequest, UseCase } from "src";
import TagRepository from "src/Api/Repository/TagRepository";

@Injectable()
export default class RemoveTagUseCase
  implements UseCase<Promise<Tag>, [tagId: number]>
{
  constructor(private readonly tagRepository: TagRepository) {}

  handle(context: ContextualGraphqlRequest, tagId: number) {
    try {
      return this.tagRepository.RemoveById(tagId);
    } catch (error) {
      throw new BadRequestException("no tag has been created", error.message);
    }
  }
}
