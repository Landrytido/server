import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/Core/Datasource/Prisma";
import {
  AutoInstructionInput,
  CreateAutoInstructionInput,
} from "../Dto/CreateAutoInstructionDto";
import { UpdateAutoInstructionInput } from "../Dto/UpdateAutoInstructionDto";

@Injectable()
export class AutoInstructionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateAutoInstructionInput) {
    return this.prisma.autoInstruction.create({
      data: {
        description: data.description,
        order: data.order,
        user: { connect: { id: data.userId } },
      },
    });
  }

  async findAll(userId: number) {
    return this.prisma.autoInstruction.findMany({
      where: { userId },
      orderBy: { order: "asc" },
    });
  }

  async update(data: UpdateAutoInstructionInput) {
    return this.prisma.autoInstruction.update({
      where: { id: data.id },
      data: {
        description: data.description,
      },
    });
  }

  async remove(id: number) {
    return this.prisma.autoInstruction.delete({
      where: { id },
    });
  }

  async orderAutoInstruction(
    userId: number,
    instructions: AutoInstructionInput[]
  ) {
    // Start a transaction to ensure the reorder operation is atomic
    const reorderTransaction = await this.prisma.$transaction(
      async (prisma: any) => {
        try {
          for (const instruction of instructions) {
            if (!instruction.id || instruction.order === undefined) {
              throw new Error("Missing id or order for instruction");
            }
            await prisma.autoInstruction.update({
              where: { id: instruction.id },
              data: { order: instruction.order },
            });
          }

          return await prisma.autoInstruction.findMany({
            where: { userId },
            orderBy: { order: "asc" },
          });
        } catch (error) {
          console.error("Error in transaction:", error);
          throw error;
        }
      }
    );
    return reorderTransaction;
  }
  async getFirstCardByUserId(userId: number) {
    return await this.prisma.autoInstruction.findFirst({
      where: { userId },
      orderBy: { createdAt: 'asc' }, 
    });
  }

  async getNextCardByUserId(userId: number, currentCardId: number) {
    return await this.prisma.autoInstruction.findFirst({
      where: {
        userId,
        id: { gt: currentCardId }, 
      },
      orderBy: { createdAt: 'asc' },
    });
  }
}
