import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/Core/Datasource/Prisma";
import {
  AutoInstructionInput,
  CreateAutoInstructionInput,
} from "../../Dto/CreateAutoInstructionDto";
import { UpdateAutoInstructionInput } from "../../Dto/UpdateAutoInstructionDto";
import {
  CreateAutoInstructionSuggestionDto
} from "../../Dto/AutoInstructionSuggestionDto/CreateAutoInstructionSuggestionDto";
import {AutoInstructionSuggestion} from "@prisma/client";

@Injectable()
export class AutoInstructionSuggestionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateAutoInstructionSuggestionDto) : Promise<AutoInstructionSuggestion> {
    return this.prisma.autoInstructionSuggestion.create({
      data: {
        description: dto.description
      },
    });
  }

  async getById(id: number) : Promise<AutoInstructionSuggestion> {
    return this.prisma.autoInstructionSuggestion.findUnique({
      where: {
        id,
      },
    });
  }

  async getAll() : Promise<AutoInstructionSuggestion[]> {
      return this.prisma.autoInstructionSuggestion.findMany();
  }
}
