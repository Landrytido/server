import { BadRequestException, ForbiddenException, Injectable, Logger } from "@nestjs/common";
import { NoteTask } from "@prisma/client";
import { ContextualGraphqlRequest, UseCase } from "src";
import { SaveNoteTaskDto } from "src/Api/Dto/SaveNoteTaskDto";
import NoteTaskRepository from "src/Api/Repository/NoteTasksRepository";


@Injectable()
export default class SaveNoteTaskUseCase
  implements UseCase<Promise<NoteTask>, [SaveNoteTaskDto]>
{
  private readonly logger = new Logger(SaveNoteTaskUseCase.name);

  constructor(private readonly noteTaskRepository: NoteTaskRepository) {}

  async handle(
    context: ContextualGraphqlRequest,
    dto: SaveNoteTaskDto
  ): Promise<NoteTask> {
    this.logger.debug(`User ID from context: ${context.userId}`);
    this.logger.debug(`DTO received: ${JSON.stringify(dto)}`);

    try {
      if (dto.id) {
        // Mise à jour existante
        const existingNoteTask = await this.noteTaskRepository.findById(dto.id);
        this.logger.debug(`Existing NoteTask: ${JSON.stringify(existingNoteTask)}`);

        if (!existingNoteTask) {
          throw new BadRequestException("NoteTask not found.");
        }

        if (context.userId !== existingNoteTask.userId) {
          throw new ForbiddenException("Not authorized to update this NoteTask.");
        }

        // Préparer les données à mettre à jour
        const updateData: Partial<SaveNoteTaskDto> = {};
        if (dto.title !== undefined) updateData.title = dto.title;
        if (dto.completed !== undefined) updateData.completed = dto.completed;
        if (dto.noteId !== undefined) updateData.noteId = dto.noteId;
        if (dto.userId !== undefined) updateData.userId = dto.userId;

        const updatedNoteTask = await this.noteTaskRepository.save({
          id: dto.id,
          ...updateData,
        });

        this.logger.debug(`Updated NoteTask: ${JSON.stringify(updatedNoteTask)}`);
        return updatedNoteTask;
      } else {
        // Création nouvelle NoteTask
        if (!dto.userId || !dto.noteId) {
          throw new BadRequestException("userId and noteId are required for creation.");
        }

        const newNoteTask = await this.noteTaskRepository.save(dto);
        this.logger.debug(`Created new NoteTask: ${JSON.stringify(newNoteTask)}`);
        return newNoteTask;
      }
    } catch (error) {
      this.logger.error(`Failed to save NoteTask: ${error.message}`, error.stack);
      throw new BadRequestException("Failed to save NoteTask.", error.message);
    }
  }
}