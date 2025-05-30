import { ContextualGraphqlRequest, UseCase } from "src";
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import Notebook from "src/Api/Entity/Notebook";
import NotebookRepository from "src/Api/Repository/NotebookRepository";

@Injectable()
export default class GetNotebookUseCase
  implements UseCase<Promise<Notebook>, [notebookId: number]>
{
  constructor(private readonly notebookRepository: NotebookRepository) {}
  async handle(
    context: ContextualGraphqlRequest,
    notebookId: number
  ): Promise<Notebook> {
    try {
      const notebook = await this.notebookRepository.findById(notebookId);
      if (!notebook) throw new NotFoundException("Notebook not found");
      return notebook;
    } catch (error) {
      throw new BadRequestException("GetNotebookUseCaseFailed", error.message);
    }
  }
}
