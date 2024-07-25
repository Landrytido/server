import { ContextualGraphqlRequest, UseCase } from "src";
import { BadRequestException, Injectable } from "@nestjs/common";
import Notebook from "src/Api/Entity/Notebook";
import NotebookRepository from "src/Api/Repository/NotebookRepository";
import SaveNotebookDto from "src/Api/Dto/SaveNotebookDto";

@Injectable()
export default class CreateNotebookUseCase
  implements UseCase<Promise<Notebook>, [dto: SaveNotebookDto]>
{
  constructor(private readonly notebookRepository: NotebookRepository) {}
  async handle(
    context: ContextualGraphqlRequest,
    dto: SaveNotebookDto
  ): Promise<Notebook> {
    try {
      return await this.notebookRepository.save(context.userId, dto);
    } catch (error) {
      throw new BadRequestException(
        "CreateNotebookUseCaseFailed",
        error.message
      );
    }
  }
}
