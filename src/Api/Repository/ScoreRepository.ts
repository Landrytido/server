// src/Repository/ScoreRepository.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/Core/Datasource/Prisma';
import { Prisma, Level } from '@prisma/client'; // Importation de Level

@Injectable()
export class ScoreRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createScore(
    data: Prisma.XOR<Prisma.ScoreCreateInput, Prisma.ScoreUncheckedCreateInput>
  ) {
    const { userId, time, level } = data;

    const createdScore = await this.prisma.score.create({
      data: {
        userId,
        time,
        level,
        firstName: data.firstName,
        lastName: data.lastName,
      },
    });

    await this.cleanUpScores();

    return createdScore;
  }

  async getTopScores(limit: number = 10, level: Level = Level.EASY) {
    return this.prisma.score.findMany({
      where: level ? { level } : undefined,
      orderBy: {
        time: 'asc',
      },
      take: limit,
    });
  }
  async getTopThreeScores(level?: Level) {
    return this.getTopScores(3, level);
  }


  async getUserScores(userId: number, level?: Level) {
    return this.prisma.score.findMany({
      where: {
        userId: userId,
        ...(level ? { level } : {}),
      },
      orderBy: {
        time: 'asc',
      },
    });
  }

  private async cleanUpScores() {
    const scores = await this.prisma.score.findMany({
      orderBy: {
        time: 'asc',
      },
      skip: 10, 
    });

    const idsToDelete = scores.map((score) => score.id);

    if (idsToDelete.length > 0) {
      await this.prisma.score.deleteMany({
        where: {
          id: {
            in: idsToDelete,
          },
        },
      });
    }
  }
}
