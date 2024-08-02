import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../Core/Datasource/Prisma";
import { Link } from "../Entity/Link";
import {Prisma} from "@prisma/client";

@Injectable()
export class LinkRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findById(id: number): Promise<Link> {
        return this.prisma.link.findUnique({
            where: {id},
            include: {
                linkGroup: true,
                user: true,
            },
        });
    }

    async findByUserId(userId: number): Promise<Link[]> {
        return this.prisma.link.findMany({
            where: {userId},
            include: {
                linkGroup: true,
                user: true,
            },
        });
    }

    async findByLinkGroupId(linkGroupId: number): Promise<Link[]> {
        return this.prisma.link.findMany({
            where: {linkGroupId},
            include: {
                linkGroup: true,
                user: true,
            },
        });
    }

    async save(userId: number, data: Prisma.XOR<Prisma.LinkCreateInput, Prisma.LinkUncheckedCreateInput> | Prisma.XOR<Prisma.LinkUpdateInput, Prisma.LinkUncheckedUpdateInput>): Promise<Link> {
        if (!data.id) {
            return this.prisma.link.create({
                data: data as Prisma.XOR<Prisma.LinkCreateInput, Prisma.LinkUncheckedCreateInput>
            })
        }

        return this.prisma.link.update({
            where: { id: data.id as number },
            data: data as Prisma.XOR<Prisma.LinkUpdateInput, Prisma.LinkUncheckedUpdateInput>
        });
    }

    async delete(id: number, userId: number): Promise<Link> {
        return this.prisma.link.delete({ where: { id: +id } });
    }
}

