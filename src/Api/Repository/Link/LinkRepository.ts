// src/Repository/Link/LinkRepository.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../Core/Datasource/Prisma';
import { SaveLinkDto } from '../../Dto/LinkDto/SaveLinkDto';
import { Link } from '@prisma/client';

@Injectable()
export default class LinkRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findById(id: string): Promise<Link | null> {
        return this.prisma.link.findUnique({ where: { id } });
    }

    async findByUrl(url: string): Promise<Link | null> {
        return this.prisma.link.findUnique({ where: { url } });
    }

    async findNotCaptured(): Promise<Link[]> {
        return this.prisma.link.findMany({
            where: {
                screenShotAt: null,
            },
        });
    }

    async findExpiredCaptured(): Promise<Link[]> {
        return this.prisma.link.findMany({
            where: {
                screenShotAt: {
                    lt: new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 7), // 7 days
                },
            },
        });
    }

    async create(dto: SaveLinkDto): Promise<Link> {
        return this.prisma.link.create({
            data: {
                url: dto.url,
                ownerId: dto.ownerId,
                imageId: dto.imageId,
                screenShotAt: dto.screenShotAt,
            },
        });
    }

    async update(id: string, data: Partial<{ url: string; ownerId: number; imageId: number; screenShotAt: Date }>): Promise<Link> {
        return this.prisma.link.update({
            where: { id },
            data,
        });
    }

    /**
     * Deletes the link if no join records exist.
     */
    async deleteIfOrphan(linkId: string): Promise<void> {
        const count = await this.prisma.linkGroupLink.count({
            where: { linkId },
        });
        if (count === 0) {
            await this.prisma.link.delete({ where: { id: linkId } });
        }
    }
}
