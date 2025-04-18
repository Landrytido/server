import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "src/Core/Datasource/Prisma";
import { Prisma } from "@prisma/client";
import AesCypherService from "src/Core/Security/AesCypher";

@Injectable()
export default class NoteRepository {
  private readonly logger = new Logger(NoteRepository.name);
  
  constructor(
    private readonly prisma: PrismaService,
    private readonly aesCypher: AesCypherService
  ) {}

  async findById(noteId: number) {
    const note = await this.prisma.note.findUnique({
      where: { id: noteId },
      include: {
        labels: true,
        user: true,
        collaborations: {
          include: {
            note: true,
            user: true,
          },
        },
      },
    });

    if (note && note.content) {
      try {
        note.content = this.decryptNoteContent(note.content);
      } catch (error) {
        this.logger.error(`Erreur lors du déchiffrement de la note ${noteId}:`, error);
      }
    }

    return note;
  }

  async findNotesByLabel(labelIds: string[]) {
    if (!labelIds.length) {
      return [];
    }

    const notes = await this.prisma.note.findMany({
      where: {
        labels: {
          some: {
            id: { in: labelIds },
          },
        },
      },
      include: {
        labels: true,
      },
    });

    return notes.map(note => {
      if (note.content) {
        try {
          note.content = this.decryptNoteContent(note.content);
        } catch (error) {
          this.logger.error(`Erreur lors du déchiffrement d'une note par label:`, error);
        }
      }
      return note;
    });
  }

  async findByUserId(userId: number, orderBy: string = "clickCounter", orderDirection: "asc" | "desc" = "desc") {
    const validFields = ["clickCounter", "createdAt", "updatedAt", "title"];
    if (!validFields.includes(orderBy)) {
      orderBy = "clickCounter";
    }

    const notes = await this.prisma.note.findMany({
      where: { userId },
      orderBy: {
        [orderBy]: orderDirection,
      },
      include: {
        collaborations: true,
        labels: true,
      },
    });

    return notes.map(note => {
      if (note.content) {
        try {
          note.content = this.decryptNoteContent(note.content);
        } catch (error) {
          this.logger.error(`Erreur lors du déchiffrement d'une note de l'utilisateur ${userId}:`, error);
        }
      }
      return note;
    });
  }

  async findMany() {
    const notes = await this.prisma.note.findMany({ include: { labels: true } });
    
    return notes.map(note => {
      if (note.content) {
        try {
          note.content = this.decryptNoteContent(note.content);
        } catch (error) {
          this.logger.error(`Erreur lors du déchiffrement d'une note:`, error);
        }
      }
      return note;
    });
  }

  async incrementClickCounter(noteId: number) {
    const note = await this.prisma.note.update({
      where: { id: noteId },
      data: {
        clickCounter: {
          increment: 1
        }
      },
      include: { labels: true }
    });

    if (note && note.content) {
      try {
        note.content = this.decryptNoteContent(note.content);
      } catch (error) {
        this.logger.error(`Erreur lors du déchiffrement après incrémentation du compteur:`, error);
      }
    }

    return note;
  }

  async save(
    data: Prisma.XOR<
      Prisma.NoteCreateInput,
      Prisma.NoteUncheckedCreateInput
    > & { labelIds?: (string | number)[] } |
    Prisma.XOR<
      Prisma.NoteUpdateInput,
      Prisma.NoteUncheckedUpdateInput
    > & { labelIds?: (string | number)[] }
  ) {
    const dataCopy = { ...data };
    
    // Encrypt content if present
    if (dataCopy.content) {
      try {
        dataCopy.content = this.encryptNoteContent(dataCopy.content as string);
      } catch (error) {
        this.logger.error(`Erreur lors du chiffrement d'une note:`, error);
      }
    }

    if (!("id" in dataCopy)) {

      const createData = dataCopy as (Prisma.NoteCreateInput | Prisma.NoteUncheckedCreateInput) & { labelIds?: (string | number)[] };
      let note;

  
      let userId: number | undefined;
      if ('userId' in createData) {
        userId = createData.userId as number;
      } else if ('user' in createData && createData.user && typeof createData.user === 'object') {
        const userInput = createData.user as any;
        if (userInput.connect && userInput.connect.id) {
          userId = userInput.connect.id;
        }
      }

      if (!userId) {
        this.logger.error("Impossible de déterminer l'utilisateur pour la note");
        throw new Error("L'identifiant de l'utilisateur est requis pour créer une note");
      }

      if (createData.labelIds && createData.labelIds.length > 0) {
        note = await this.prisma.note.create({
          data: {
            ...createData,
            labels: {
              connect: createData.labelIds.map((id) => ({ id: String(id) })),
            },
          },
          include: { labels: true },
        });
     
      if (note.content) {
        try {
          note.content = this.decryptNoteContent(note.content);
        } catch (error) {
          this.logger.error(`Erreur lors du déchiffrement d'une note nouvellement créée:`, error);
        }
      }
      
      return note;
    }else {
     
       const note = await this.prisma.note.create({
        data: {
          ...createData,
         
        },
        include: { labels: true },
      });

      // Decrypt before returning
      if (note.content) {
        try {
          note.content = this.decryptNoteContent(note.content);
        } catch (error) {
          this.logger.error(`Erreur lors du déchiffrement d'une note nouvellement créée:`, error);
        }
      }
      
      return note;
    }
  }
    const { labelIds, ...updateData } = dataCopy as Prisma.NoteUpdateInput & { labelIds?: (string | number)[] };
    let note;

    if (labelIds !== undefined) {
      note = await this.prisma.note.update({
        where: {
          id: dataCopy.id as number,
        },
        data: {
          ...updateData,
          labels: {
            set: [],
            connect: labelIds?.length ? labelIds.map((id) => ({ id: String(id) })) : [],
          },
        },
        include: { labels: true },
      });
    } else {
      note = await this.prisma.note.update({
        where: {
          id: dataCopy.id as number,
        },
        data: updateData,
        include: { labels: true },
      });
    }

    // Decrypt before returning
    if (note.content) {
      try {
        note.content = this.decryptNoteContent(note.content);
      } catch (error) {
        this.logger.error(`Erreur lors du déchiffrement d'une note mise à jour:`, error);
      }
    }
    
    return note;
  }

  async remove(noteId: number) {
    return this.prisma.note.delete({ where: { id: noteId } });
  }

  // Méthode privée pour chiffrer le contenu de la note
  private encryptNoteContent(content: string | object | unknown): string {
    // Si le contenu est un objet, nous le convertissons en chaîne
    const contentStr = typeof content === 'object' ? JSON.stringify(content) : String(content);
    return this.aesCypher.encryptData(contentStr);
  }

  // Méthode privée pour déchiffrer le contenu de la note
  private decryptNoteContent(encryptedContent: string): string {
    const decryptedContent = this.aesCypher.decryptData(encryptedContent);
    return decryptedContent;
  }
}