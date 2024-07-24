import { BadRequestException, Injectable } from "@nestjs/common";
import { ContextualGraphqlRequest, UseCase } from "src";
import { SaveTagDto } from "src/Api/Dto/SaveTagDto";
import { Tag } from "src/Api/Entity/Tag";
import TagRepository from "src/Api/Repository/TagRepository";

@Injectable()
export default class CreateTagUseCase
  implements UseCase<Promise<Tag>, [dto: SaveTagDto]>
{
  constructor(private readonly tageRepository: TagRepository) {}
  async handle(
    context: ContextualGraphqlRequest,
    dto: SaveTagDto
  ): Promise<Tag> {
    try {
      return await this.tageRepository.create(dto);
    } catch (error) {
      throw new BadRequestException("Impossible de créer le tag");
    }
  }
}
