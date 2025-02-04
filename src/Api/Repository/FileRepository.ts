import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../Core/Datasource/Prisma";
import { Prisma } from "@prisma/client";

@Injectable()
export default class FileRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findById(id: number) {
        return this.prisma.file.findUnique({
            where: { id },
        });
    }

    async saveFile(
        data:
            | Prisma.XOR<Prisma.FileCreateInput, Prisma.FileUncheckedCreateInput>
            | Prisma.XOR<Prisma.FileUpdateInput, Prisma.FileUncheckedUpdateInput>
    ) {
        if (!data.id) {
            return this.prisma.file.create({
                data: data as Prisma.XOR<
                    Prisma.FileCreateInput,
                    Prisma.FileUncheckedCreateInput
                >,
            });
        }

        return this.prisma.file.update({
            where: { id: data.id as number },
            data: data as Prisma.XOR<
                Prisma.FileUpdateInput,
                Prisma.FileUncheckedUpdateInput
            >,
        });
    }

    async delete(id: number) {
        return this.prisma.file.delete({
            where: { id },
        });
    }

    async findAll() {
        return this.prisma.file.findMany();
    }

    async findByFilename(filename: string) {
        return this.prisma.file.findMany({
            where: { filename: { contains: filename } },
        });
    }
}
