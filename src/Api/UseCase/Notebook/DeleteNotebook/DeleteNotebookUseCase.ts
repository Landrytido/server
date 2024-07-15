import { ContextualGraphqlRequest, UseCase } from "src";
import { BadRequestException, Injectable } from "@nestjs/common";
import { Notebook } from "src/Api/Entity/Notebook";
import { NotebookRepository } from "src/Api/Repository/NotebookRepository";

@Injectable()
export class DeleteNotebookUseCase
  implements UseCase<Promise<Notebook>, [notebookId: number]>
{
  constructor(private readonly notebookRepository: NotebookRepository) {}
  async handle(
    context: ContextualGraphqlRequest,
    notebookId: number
  ): Promise<Notebook> {
    try {
      return await this.notebookRepository.remove(notebookId, context.userId);
    } catch (error) {
      throw new BadRequestException("Failed to delete notebook", error.message);
    }
  }
}
