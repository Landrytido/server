import { PrismaService } from "../../Core/Datasource/Prisma";
import { Injectable } from "@nestjs/common";
import { LinkGroup } from "../Entity/LinkGroup";
import { Prisma } from "@prisma/client";

@Injectable()
export default class LinkGroupRepository {
    constructor(private readonly prisma: PrismaService) {}
    async findById(id: number) {
        return this.prisma.linkGroup.findUnique({
            where: { id },
            include: { user: true },
        });
    }

    async findByUserId(userId: number): Promise<LinkGroup[]> {
        return this.prisma.linkGroup.findMany({
            where: { userId },
            include: {
                links: {
                    include: {
                        linkGroup: true,
                        user: true
                    }
                },
                user: true,
            }
        })
    }

    async findAll(): Promise<LinkGroup[]> {
        return this.prisma.linkGroup.findMany({
            include: { user: true },
        });
    }

    async save(userId: number, data: Prisma.XOR<Prisma.LinkGroupCreateInput, Prisma.LinkGroupUncheckedCreateInput> | Prisma.XOR<Prisma.LinkGroupUpdateInput, Prisma.LinkGroupUncheckedUpdateInput>): Promise<LinkGroup> {
        if (!data.id) {
            return this.prisma.linkGroup.create({
                data: {
                    name: data.name as string,
                    description: data.description as string,
                    user: {
                        connect: { id: userId },
                    },
                    links: {
                        create: [],
                    },
                },
                include: {
                    user: true,
                    links: {
                        include: {
                            user: true,
                            linkGroup: true
                        }
                    }
                },
            });
        }

        return this.prisma.linkGroup.update({
            where: {
                id: data.id as number,
            },
            data: {
                name: data.name,
                description: data.description as string,
            },
            include: {
                user: true,
                links: {
                    include: {
                        user: true,
                        linkGroup: true
                    }
                }
            },
        });
    }

    async delete(linkGroupId: number, userId: number):Promise<LinkGroup> {
        return this.prisma.linkGroup.delete({ where: { id: +linkGroupId } });
    }
}