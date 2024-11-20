import { BadRequestException, ForbiddenException, Injectable } from "@nestjs/common";
import { NoteTask } from "@prisma/client";
import { ContextualGraphqlRequest, UseCase } from "src";
import { SaveNoteTaskDto } from "src/Api/Dto/SaveNoteTaskDto";
import NoteTaskRepository from "src/Api/Repository/NoteTasksRepository";

@Injectable()
export default class SaveNoteTaskUseCase
  implements UseCase<Promise<NoteTask>, [SaveNoteTaskDto]>
{
  constructor(private readonly noteTaskRepository: NoteTaskRepository) {}

  async handle(
    context: ContextualGraphqlRequest,
    dto: SaveNoteTaskDto
  ): Promise<NoteTask> {
    try {
      if (dto.id) {
        const existingNoteTask = await this.noteTaskRepository.findById(dto.id);

        if (!existingNoteTask) {
          throw new BadRequestException("NoteTask not found.");
        }

        if (context.userId !== existingNoteTask.userId) {
          throw new ForbiddenException("Not authorized to update this NoteTask.");
        }

        const updateData: Partial<SaveNoteTaskDto> = {};
        if (dto.title !== undefined) updateData.title = dto.title;
        if (dto.completed !== undefined) updateData.completed = dto.completed;
        if (dto.noteId !== undefined) updateData.noteId = dto.noteId;
        if (dto.userId !== undefined) updateData.userId = dto.userId;
        if (dto.parentId !== undefined) updateData.parentId = dto.parentId;

        const updatedNoteTask = await this.noteTaskRepository.save({
          id: dto.id,
          ...updateData,
        });

        return updatedNoteTask;
      } else {
        if (!dto.userId || !dto.noteId) {
          throw new BadRequestException("userId and noteId are required for creation.");
        }

        const newNoteTask = await this.noteTaskRepository.save(dto);
        return newNoteTask;
      }
    } catch (error) {
      throw new BadRequestException("Failed to save NoteTask.", error.message);
    }
  }
}
