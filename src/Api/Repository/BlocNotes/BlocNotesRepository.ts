// src/Api/Repository/BlocNotes/BlocNotesRepository.ts
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../Core/Datasource/Prisma";
import AesCypher from "src/Core/Security/AesCypher";
// import BlocNote from "src/Api/Entity/BlocNote";
import {BlocNote} from "@prisma/client";




@Injectable()
export default class BlocNotesRepository {
    constructor(
        private readonly prisma: PrismaService,
        private readonly aesCypher: AesCypher,
    ) {
    }

    async findByUserId(userId: number): Promise<BlocNote | null> {
        const blocNote = await this.prisma.blocNote.findUnique({
            where: { userId },
        });
        if (blocNote && blocNote.content) {
            blocNote.content = this.aesCypher.decryptData(blocNote.content);
        }
        return blocNote;
    }

    async upsert(userId: number, content: string): Promise<BlocNote> {
        if (!content) {
            throw new Error("Le contenu du bloc-note est vide ou undefined.");
        }

        const encryptedContent = this.aesCypher.encryptData(content);
        return this.prisma.blocNote.upsert({
            where: { userId },
            update: { content: encryptedContent },
            create: { userId, content: encryptedContent },
        });
    }
}