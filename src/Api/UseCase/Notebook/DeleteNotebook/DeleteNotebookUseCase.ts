import { ContextualGraphqlRequest, UseCase } from "src";
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import Notebook from "src/Api/Entity/Notebook";
import NotebookRepository from "src/Api/Repository/NotebookRepository";
import InsufficientPermissionException from "src/Core/Exception/InsufficientPermissionException";

@Injectable()
export default class DeleteNotebookUseCase
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

      if (notebook.userId !== context.userId)
        throw new InsufficientPermissionException(
          "You don't have permission to delete this notebook"
        );

      return await this.notebookRepository.remove(notebookId, context.userId);
    } catch (error) {
      throw new BadRequestException(
        "DeleteNotebookUseCaseFailed",
        error.message
      );
    }
  }
}
