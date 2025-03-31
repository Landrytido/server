import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/Core/Datasource/Prisma";
import { Label } from "../Entity/Label";

@Injectable()
export class LabelRepository { 
    constructor(private readonly prisma: PrismaService) {}

    async create(name: string): Promise<Label> {
        return await this.prisma.label.create({
            data: {
                name,
            },
        });
    }

    async findAll(): Promise<Label[]> {
        return await this.prisma.label.findMany({
        });
    }

    async findById(id: string): Promise<Label | null> {
        return await this.prisma.label.findUnique({
            where: { id },
        });
    }

    
}