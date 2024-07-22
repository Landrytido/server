import { ContextualGraphqlRequest, UseCase } from "src";
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import Notebook from "src/Api/Entity/Notebook";
import NotebookRepository from "src/Api/Repository/NotebookRepository";
import SaveNotebookDto from "src/Api/Dto/SaveNotebookDto";
import InsufficientPermissionException from "src/Core/Exception/InsufficientPermissionException";

@Injectable()
export default class UpdateNotebookUseCase
  implements
    UseCase<Promise<Notebook>, [notebookId: number, dto: SaveNotebookDto]>
{
  constructor(private readonly notebookRepository: NotebookRepository) {}

  async handle(
    context: ContextualGraphqlRequest,
    notebookId: number,
    dto: SaveNotebookDto
  ): Promise<Notebook> {
    try {
      const notebook = await this.notebookRepository.findById(notebookId);

      if (!notebook) throw new NotFoundException("Aucun carnet n'a été trouvé");

      if (notebook.userId !== context.userId)
        throw new InsufficientPermissionException(
          "Ce carnet ne vous appartient pas, vous ne pouvez donc pas le modifier"
        );

      return this.notebookRepository.save(context.userId, {
        id: notebookId,
        ...dto,
      });
    } catch (error) {
      throw new BadRequestException("Failed to update notebook", error.message);
    }
  }
}
