import { Injectable } from "@nestjs/common";
import { ContextualGraphqlRequest } from "src";
import { PrismaService } from "src/Core/Datasource/Prisma";

@Injectable()
export class SharingService {
  constructor(private readonly prisma: PrismaService) {}

  async searchUsersByEmail(context: ContextualGraphqlRequest, query: string) {
    if (!query || query.trim().length < 3) {
      return [];
    }
  
    const { userId } = context; // Récupérer l'utilisateur actuel
  
    // Récupérer les relations (amis) de l'utilisateur actuel
    const relations = await this.prisma.invitation.findMany({
      where: {
        AND: [
          { isRelation: true },
          {
            OR: [{ senderId: userId }, { receiverId: userId }],
          },
        ],
      },
      select: {
        senderId: true,
        receiverId: true,
      },
    });
  
    // Extraire les IDs des amis
    const friendIds = relations.map(rel => 
      rel.senderId === userId ? rel.receiverId : rel.senderId
    );
  
    if (friendIds.length === 0) {
      return [];
    }
  
    // Chercher les amis en fonction du query
    return await this.prisma.user.findMany({
      where: {
        id: { in: friendIds },
        email: { contains: query }, // Ignore la casse
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
      },
      take: 10,
    });
  }
  

  async getNotesSharedWithMe(userId: number) {
    return this.prisma.sharedNote.findMany({
      where: { sharedWithUserId: userId },
      include: {
        note: true,
        sharedByUser: true
      }
    });
  }
}