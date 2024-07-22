import { PrismaService } from "src/Core/Datasource/Prisma";
import Note from "../Entity/Note";
import CreateOrUpdateNote from "../Dto/SaveNoteDto";
import { NotImplementedException } from "@nestjs/common/exceptions";

export default class NoteRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(noteId: number): Promise<Note> {
    throw new NotImplementedException();
  }

  async findMany(): Promise<Note[]> {
    throw new NotImplementedException();
  }

  async create(userId: number, dto: CreateOrUpdateNote): Promise<Note> {
    throw new NotImplementedException();
  }

  async remove(noteId: number, userId: number): Promise<Note> {
    throw new NotImplementedException();
  }

  async update(noteId: number, userId: number): Promise<Note> {
    throw new NotImplementedException();
  }
}
