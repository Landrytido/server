import { BadRequestException, Injectable } from "@nestjs/common";
import { ContextualGraphqlRequest, UseCase } from "src";
import { Tag } from "src/Api/Entity/Tag";
import TagRepository  from "src/Api/Repository/TagRepository";

@Injectable()
export default class GetTagUseCase implements UseCase<Promise<Tag>, [tagId: number]> {
    constructor(private readonly tagRepository: TagRepository) {}

    handle(context: ContextualGraphqlRequest, tagId: number): Promise<Tag> {
        try {
            return this.tagRepository.findById(tagId);
        } catch (error) {
            throw new BadRequestException("Impossible de trouver le tag");
        }
    }
}
