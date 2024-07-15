import { ContextualGraphqlRequest, UseCase } from "src";
import { BadRequestException, Injectable } from "@nestjs/common";
import { Notebook } from "src/Api/Entity/Notebook";
import { NotebookRepository } from "src/Api/Repository/NotebookRepository";
import { CreateOrUpdateNotebook } from "../../../Dto/CreateOrUpdateNoteBook";

@Injectable()
export class UpdateNotebookUseCase
  implements
    UseCase<
      Promise<Notebook>,
      [notebookId: number, dto: CreateOrUpdateNotebook]
    >
{
  constructor(private readonly notebookRepository: NotebookRepository) {}

  handle(
    context: ContextualGraphqlRequest,
    notebookId: number,
    dto: CreateOrUpdateNotebook
  ): Promise<Notebook> {
    try {
      return this.notebookRepository.update(context.userId, notebookId, dto);
    } catch (error) {
      throw new BadRequestException("Failed to update notebook", error.message);
    }
  }
}
