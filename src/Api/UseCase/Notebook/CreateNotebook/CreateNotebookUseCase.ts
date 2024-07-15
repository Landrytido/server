import { ContextualGraphqlRequest, UseCase } from "src";
import { BadRequestException, Injectable } from "@nestjs/common";
import { Notebook } from "src/Api/Entity/Notebook";
import { NotebookRepository } from "src/Api/Repository/NotebookRepository";
import { CreateOrUpdateNotebook } from "../../../Dto/CreateOrUpdateNoteBook";

@Injectable()
export class CreateNotebookUseCase
  implements UseCase<Promise<Notebook>, [dto: CreateOrUpdateNotebook]>
{
  constructor(private readonly notebookRepository: NotebookRepository) {}
  handle(
    context: ContextualGraphqlRequest,
    dto: CreateOrUpdateNotebook
  ): Promise<Notebook> {
    try {
      return this.notebookRepository.create(context.userId, dto);
    } catch (error) {
      throw new BadRequestException("Failed to create notebook", error.message);
    }
  }
}
