import { ContextualGraphqlRequest, UseCase } from "src";
import { BadRequestException, Injectable } from "@nestjs/common";
import Notebook from "src/Api/Entity/Notebook";
import NotebookRepository from "src/Api/Repository/NotebookRepository";

@Injectable()
export default class GetNotebooksByUserIdUseCase
  implements UseCase<Promise<Notebook[]>, []>
{
  constructor(private readonly notebookRepository: NotebookRepository) {}
  handle(context: ContextualGraphqlRequest): Promise<Notebook[]> {
    try {
      return this.notebookRepository.findByUserId(context.userId);
    } catch (error) {
      throw new BadRequestException(
        "GetNotebooksByUserIdUseCaseFailed",
        error.message
      );
    }
  }
}
