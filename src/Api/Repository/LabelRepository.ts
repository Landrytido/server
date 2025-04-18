import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/Core/Datasource/Prisma";
import { Label } from "../Entity/Label";

@Injectable()
export class LabelRepository { 
    constructor(private readonly prisma: PrismaService) {}

    async create(name: string, userId: number): Promise<Label> {
        return await this.prisma.label.create({
            data: {
                name,
                userId,
            },
        });
    }

    async findAll(userId: number): Promise<Label[]> {
        return await this.prisma.label.findMany({
            where: {
                userId
            }
        });
    }

    async findById(id: string): Promise<Label | null> {
        return await this.prisma.label.findUnique({
            where: { id },
        });
    }
    
    async hasAssociatedNotes(labelId: string): Promise<boolean> {
        const count = await this.prisma.note.count({
            where: {
                labels: {
                    some: { id: labelId }
                }
            }
        });
        return count > 0;
    }
    
    async delete(id: string): Promise<Label> {
        return await this.prisma.$transaction(async (tx) => {
            const label = await tx.label.findUnique({
                where: { id },
                include: { notes: true }
            });
    
            if (!label) {
                throw new Error(`Label with id ${id} not found`);
            }
    
            const notesWithLabel = await tx.note.findMany({
                where: {
                    labels: {
                        some: { id }
                    }
                },
                include: {
                    labels: true
                }
            });
    
            for (const note of notesWithLabel) {
                await tx.note.update({
                    where: { id: note.id },
                    data: {
                        labels: {
                            disconnect: { id }
                        }
                    }
                });
            }
    
            await tx.label.delete({
                where: { id }
            });
    
            return label;
        });
    }

    async update(id: string, name: string): Promise<Label> {
        return await this.prisma.label.update({
            where: { id },
            data: { name }
        });
    }
    
    async belongsToUser(labelId: string, userId: number): Promise<boolean> {
        const label = await this.prisma.label.findFirst({
            where: {
                id: labelId,
                userId: userId
            }
        });
        return !!label;
    }
}