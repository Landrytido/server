import {ForbiddenException, Injectable, NotFoundException} from "@nestjs/common";
import {PrismaService} from "../../Core/Datasource/Prisma";
import {CreateLinkDto} from "../UseCase/Link/CreateLink/CreateLinkDto";
import {Link} from "../Entity/Link";
import {UpdateLinkDto} from "../UseCase/Link/UpdateLink/UpdateLinkDto";
import {Prisma} from "@prisma/client";

@Injectable()
export class LinkRepository {
    constructor(private readonly prisma: PrismaService) {}

    async create(userId: number, createLinkDto: CreateLinkDto): Promise<Link> {
        return this.prisma.link.create({
            data: {
                name: createLinkDto.name,
                url: createLinkDto.url,
                description: createLinkDto.description,
                linkGroup: {
                    connect: {id: createLinkDto.linkGroupId},
                },
                user:{
                    connect:{id:userId},
                }
            },
        });
    }

    async findById(id: number): Promise<Link> {
        return this.prisma.link.findUnique({
            where: { id },
            include: {
                linkGroup: true,
                user: true,
            },
        });
    }

    async findByUserId(userId: number): Promise<Link[]> {
        return this.prisma.link.findMany({
            where: { userId },
            include: {
                linkGroup: true,
                user: true,
            },
        });
    }

    async findByLinkGroupId(linkGroupId: number): Promise<Link[]> {
        return this.prisma.link.findMany({
            where: { linkGroupId },
            include: {
                linkGroup: true,
                user: true,
            },
        });
    }

    async update(id: number, userId:number, dto: UpdateLinkDto): Promise<Link> {
        const link = await this.prisma.link.findUnique({
            where: { id },
        });
        if (!link) {
            throw new NotFoundException(`Link with ID ${id} not found`);
        }
        if (link.userId !== userId) {
            throw new ForbiddenException('You do not have permission to update this link group');
        }
        console.log('Updating LinkGroup with data:', dto);
        const data: Prisma.LinkUpdateInput = {
            name: dto.name,
            description: dto.description ?? null,
            url: dto.url ?? null,
        }


        return this.prisma.link.update({
            where: { id },
            data,
        });
    }

    async delete(id: number, userId: number): Promise<Link> {
        const link = await this.prisma.link.findUnique({
            where: { id },
        });

        if (!link) {
            throw new NotFoundException(`Link with ID ${id} not found`);
        }

        if (link.userId !== userId) {
            throw new ForbiddenException('You do not have permission to delete this link');
        }

        return this.prisma.link.delete({
            where: { id },
        });
    }
}