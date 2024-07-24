import { BadRequestException, Injectable } from "@nestjs/common";
import { ContextualGraphqlRequest, UseCase } from "src";
import { SaveTagDto } from "src/Api/Dto/SaveTagDto";
import { Tag } from "src/Api/Entity/Tag";
import TagRepository from "src/Api/Repository/TagRepository";

@Injectable()
export default class UpdateTagUseCase
  implements UseCase<Promise<Tag>, [tagId: number,dto:SaveTagDto]>
{
  constructor(private readonly tagRepository: TagRepository) {}
  handle (context: ContextualGraphqlRequest, tagId: number, dto:SaveTagDto ): Promise<Tag> {
    try {
        return this.tagRepository.UpdateById(tagId,dto);
    } catch (error) {
        throw new BadRequestException("impossible de mettre a jour le tag");
        
    }
  }
}
