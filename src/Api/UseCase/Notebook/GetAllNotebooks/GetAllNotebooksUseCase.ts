import { ContextualGraphqlRequest, UseCase } from "src";
import { BadRequestException, Injectable } from "@nestjs/common";
import Notebook from "src/Api/Entity/Notebook";
import NotebookRepository from "src/Api/Repository/NotebookRepository";

@Injectable()
export default class GetAllNotebooksUseCase
  implements UseCase<Promise<Notebook[]>, []>
{
  constructor(private readonly notebookRepository: NotebookRepository) {}
  async handle(context: ContextualGraphqlRequest): Promise<Notebook[]> {
    try {
      return await this.notebookRepository.findMany();
    } catch (error) {
      throw new BadRequestException(
        "GetAllNotebooksUseCaseFailed",
        error.message
      );
    }
  }
}
