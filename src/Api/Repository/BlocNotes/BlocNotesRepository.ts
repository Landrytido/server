// src/Api/Repository/BlocNotes/BlocNotesRepository.ts
import {Injectable} from "@nestjs/common";
import {PrismaService} from "../../../Core/Datasource/Prisma";

@Injectable()
export default class BlocNotesRepository {
    constructor(
        private readonly prisma : PrismaService
    ) {
    }

    async findByUserId(userId: number) {
        return this.prisma.blocNote.findUnique({
            where: {userId},
        });
    }

    async upsert(userId: number, content: string) {
        return this.prisma.blocNote.upsert({
            where: {userId},
            update: {content},
            create: {userId, content},
        });
    }
}