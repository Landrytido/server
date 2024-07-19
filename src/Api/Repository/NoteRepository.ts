import { PrismaService } from "src/Core/Datasource/Prisma";
import Note from "../Entity/Note";
import CreateOrUpdateNote from "../Dto/SaveNoteDto";
import { NotImplementedException } from "@nestjs/common/exceptions";

export default class NoteRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Find a note
   * @param noteId
   */
  async findById(noteId: number): Promise<Note> {
    throw new NotImplementedException();
  }

  /**
   * Find all notes
   */
  async findMany(): Promise<Note[]> {
    throw new NotImplementedException();
  }

  /**
   * Create a note
   * @param notebookId
   */
  async create(userId: number, dto: CreateOrUpdateNote): Promise<Note> {
    throw new NotImplementedException();
  }

  /**
   * Remove a note
   * @param noteId
   * @param userId
   */
  async remove(noteId: number, userId: number): Promise<Note> {
    throw new NotImplementedException();
  }

  /**
   * Update a note
   * @param noteId
   * @param userId
   */
  async update(noteId: number, userId: number): Promise<Note> {
    throw new NotImplementedException();
  }
}
