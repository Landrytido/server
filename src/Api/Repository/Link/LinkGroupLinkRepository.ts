// src/Repository/Link/LinkGroupLinkRepository.ts
import {Injectable} from '@nestjs/common';
import {PrismaService} from '../../../Core/Datasource/Prisma';
import {LinkGroupLink} from '@prisma/client';

@Injectable()
export default class LinkGroupLinkRepository {
    constructor(private readonly prisma: PrismaService) {
    }

    async find(linkGroupId: string, linkId: string): Promise<LinkGroupLink | null> {
        return this.prisma.linkGroupLink.findUnique({
            where: {linkGroupId_linkId: {linkGroupId, linkId}},
        });
    }

    async create(linkGroupId: string, linkId: string, linkName: string): Promise<LinkGroupLink> {
        return this.prisma.linkGroupLink.create({
            data: {linkGroupId, linkId, linkName},
        });
    }

    async updateLinkName(linkGroupId: string, linkId: string, linkName: string): Promise<LinkGroupLink> {
        return this.prisma.linkGroupLink.update({
            where: {linkGroupId_linkId: {linkGroupId, linkId}},
            data: {linkName},
        });
    }

    // Updated delete method using deleteMany to avoid error if record doesn't exist.
    async delete(linkGroupId: string, linkId: string): Promise<void> {
        await this.prisma.linkGroupLink.deleteMany({
            where: {linkGroupId, linkId},
        });
    }

    async incrementClickCounter(linkGroupId: string, linkId: string): Promise<LinkGroupLink> {
        return this.prisma.linkGroupLink.update({
            where: {linkGroupId_linkId: {linkGroupId, linkId}},
            data: {clickCounter: {increment: 1}},
        });
    }

    async resetClickCounter(linkGroupId: string, linkId: string): Promise<LinkGroupLink> {
        return this.prisma.linkGroupLink.update({
            where: {linkGroupId_linkId: {linkGroupId, linkId}},
            data: {clickCounter: 0},
        });
    }

    async findHotLinks(userId: number, limit: number): Promise<LinkGroupLink[]> {
        return this.prisma.linkGroupLink.findMany({
            where: {
                clickCounter : {gt: 0},
                OR: [
                    {link: {ownerId: userId}},
                    {linkGroup: {userId: userId}}
                ]
            },
            orderBy: {clickCounter: 'desc'},
            take: limit,
            include: {
                link: true,
                linkGroup: true,
            }
        });
    }

}
