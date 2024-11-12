// src/Api/UseCase/NoteTasks/UpdateNoteTask/UpdateNoteTaskUseCase.ts
import { BadRequestException, ForbiddenException, Injectable } from "@nestjs/common";
import { NoteTask } from "@prisma/client";
import { ContextualGraphqlRequest, UseCase } from "src";
import { UpdateNoteTaskDto } from "./UpdateNoteTaskDto";
import NoteTaskRepository from "src/Api/Repository/NoteTasksRepository";

@Injectable()
export default class UpdateNoteTaskUseCase
  implements UseCase<Promise<NoteTask>, [UpdateNoteTaskDto]>
{
  constructor(private readonly noteTaskRepository: NoteTaskRepository) {}

  async handle(
    context: ContextualGraphqlRequest,
    dto: UpdateNoteTaskDto
  ): Promise<NoteTask> {
    try {
      if (!dto.id) {
        throw new BadRequestException("NoteTask ID is required for update.");
      }

      const existingNoteTask = await this.noteTaskRepository.findById(dto.id);
      if (!existingNoteTask) {
        throw new BadRequestException("NoteTask not found.");
      }

      if (context.userId !== existingNoteTask.userId) {
        throw new ForbiddenException("Not authorized to update this NoteTask.");
      }

      // Préparer les données à mettre à jour uniquement les champs pertinents
      const updateData: Partial<UpdateNoteTaskDto> = {};
      if (dto.title !== undefined) updateData.title = dto.title;
      if (dto.completed !== undefined) updateData.completed = dto.completed;

      return await this.noteTaskRepository.save({
        id: dto.id,
        ...updateData,
      });
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof ForbiddenException) {
        throw error;
      }
      throw new BadRequestException("Failed to update NoteTask.", error.message);
    }
  }
}
