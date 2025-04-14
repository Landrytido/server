import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/Core/Datasource/Prisma";
import {
  AutoInstructionInput,
  CreateAutoInstructionInput,
} from "../Dto/CreateAutoInstructionDto";
import { UpdateAutoInstructionInput } from "../Dto/UpdateAutoInstructionDto";
import { AutoInstruction } from "@prisma/client";

@Injectable()
export class AutoInstructionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateAutoInstructionInput, userId: number) {
    if (!userId) {
      throw new Error("User ID is required to create an auto instruction");
    }

    return this.prisma.autoInstruction.create({
      data: {
        description: data.description,
        order: data.order,
        user: { connect: { id: userId } },
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

  async remove(id: number): Promise<AutoInstruction> {
    return this.prisma.$transaction(async (prisma) => {
      const deletedInstruction = await prisma.autoInstruction.delete({
        where: { id },
      });

      // RE ORDER THE INSTRUCTION AFTER DELETION
      const remainingInstructions = await prisma.autoInstruction.findMany({
        orderBy: { order: "asc" },
      });
      for (let i = 0; i < remainingInstructions.length; i++) {
        await prisma.autoInstruction.update({
          where: { id: remainingInstructions[i].id },
          data: { order: i + 1 },
        });
      }

      return deletedInstruction;
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
      orderBy: { createdAt: "asc" },
    });
  }

  async getNextCardByUserId(userId: number, currentCardId: number) {
    return await this.prisma.autoInstruction.findFirst({
      where: {
        userId,
        id: { gt: currentCardId },
      },
      orderBy: { createdAt: "asc" },
    });
  }
}
