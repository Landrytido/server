import { BadRequestException, Injectable } from "@nestjs/common";
import { Tag } from "@prisma/client";
import { ContextualGraphqlRequest, UseCase } from "src";
import SaveTagDto from "src/Api/Dto/SaveTagDto";
import TagRepository from "src/Api/Repository/TagRepository";

@Injectable()
export default class UpdateTagUseCase
  implements UseCase<Promise<Tag>, [tagId: number, dto: SaveTagDto]>
{
  constructor(private readonly tagRepository: TagRepository) {}
  handle(context: ContextualGraphqlRequest, tagId: number, dto: SaveTagDto) {
    try {
      return this.tagRepository.save({
        ...dto,
        id: tagId,
      });
    } catch (error) {
      throw new BadRequestException("update is not possible ", error.message);
    }
  }
}
