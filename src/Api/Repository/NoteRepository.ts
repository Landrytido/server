import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "src/Core/Datasource/Prisma";
import { Note, Prisma } from "@prisma/client";
import AesCypherService from "src/Core/Security/AesCypher";

@Injectable()
export default class NoteRepository {
  private readonly logger = new Logger(NoteRepository.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly aesCypher: AesCypherService
  ) {}

  async findById(noteId: number): Promise<Note | null> {
    const note = await this.prisma.note.findUnique({
      where: { id: noteId },
    });
    if (note && note.content) {
      try {
        // Decrypt sous forme de chaîne
        note.content = this.decryptNoteContent(note.content);
      } catch (error) {
        this.logger.error(`Erreur lors du déchiffrement de la note ${noteId}:`, error);
      }
    }
    return note;
  }

  async findByUserId(userId: number): Promise<Note[]> {
    const notes = await this.prisma.note.findMany({
      where: { userId },
      include: {
        collaborations: true,
      },
    });
    
    return notes.map(note => {
      if (note.content) {
        try {
           // Decrypt le contenu mais le garder sous forme de chaîne
          note.content = this.decryptNoteContent(note.content);
        } catch (error) {
          this.logger.error(`Erreur lors du déchiffrement d'une note de l'utilisateur ${userId}:`, error);
        }
      }
      return note;
    });
  }

  async findMany(): Promise<Note[]> {
    const notes = await this.prisma.note.findMany();
    return notes.map(note => {
      if (note.content) {
        try {
          //Decrypt le contenu mais le garder sous forme de chaîne
          note.content = this.decryptNoteContent(note.content);
        } catch (error) {
          this.logger.error(`Erreur lors du déchiffrement d'une note:`, error);
        }
      }
      return note;
    });
  }

  async save(
    data:
      | Prisma.XOR<Prisma.NoteCreateInput, Prisma.NoteUncheckedCreateInput>
      | Prisma.XOR<Prisma.NoteUpdateInput, Prisma.NoteUncheckedUpdateInput>
  ): Promise<Note> {
    const dataCopy = { ...data };
    // Encrypt 
    if (dataCopy.content) {
      try {
        dataCopy.content = this.encryptNoteContent(dataCopy.content as string);
      } catch (error) {
        this.logger.error(`Erreur lors du chiffrement d'une note:`, error);
      }
    }
    
    if (!dataCopy.id) {
      const note = await this.prisma.note.create({
        data: dataCopy as Prisma.XOR<
          Prisma.NoteCreateInput,
          Prisma.NoteUncheckedCreateInput
        >,
      });
      // Decrypt 
      if (note.content) {
        try {
          note.content = this.decryptNoteContent(note.content);
        } catch (error) {
          this.logger.error(`Erreur lors du déchiffrement d'une note nouvellement créée:`, error);
        }
      }
      return note;
    }

    const note = await this.prisma.note.update({
      where: {
        id: dataCopy.id as number,
      },
      data: dataCopy as Prisma.XOR<
        Prisma.NoteUpdateInput,
        Prisma.NoteUncheckedUpdateInput
      >,
    });
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
