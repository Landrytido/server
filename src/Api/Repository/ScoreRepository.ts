import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/Core/Datasource/Prisma';
import { SaveScoreDto } from '../Dto/SaveScoreDto';

@Injectable()
export class ScoreRepository {
  constructor(private prisma: PrismaService) {}

  // Crée un score et gère la suppression automatique des scores au-delà du 15e
  async createScore(data: SaveScoreDto) {
    // Envoie uniquement les champs userId et time à Prisma
    const { userId, time } = data;

    const createdScore = await this.prisma.score.create({
      data: {
        userId,
        time,
      },
    });

    // Appelle la méthode pour supprimer les scores au-delà du 15e
    await this.cleanUpScores();

    return createdScore;
  }

  // Récupère les 15 meilleurs scores, triés par temps ascendant
  async getTopScores(limit: number = 15) {
    return this.prisma.score.findMany({
      orderBy: {
        time: 'asc',
      },
      take: limit,
    });
  }

  // Récupère les 3 meilleurs scores
  async getTopThreeScores() {
    return this.getTopScores(3);
  }

  // Supprime les scores au-delà du 15e
  private async cleanUpScores() {
    const scores = await this.prisma.score.findMany({
      orderBy: {
        time: 'asc',
      },
      skip: 15, // On ne conserve que les 15 premiers
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
