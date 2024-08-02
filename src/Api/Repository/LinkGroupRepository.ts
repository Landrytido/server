import {PrismaService} from "../../Core/Datasource/Prisma";
import {ForbiddenException, Injectable, NotFoundException} from "@nestjs/common";
import {LinkGroup} from "../Entity/LinkGroup";
import {Prisma} from "@prisma/client";
import {CreateLinkGroupDto} from "../UseCase/LinkGroup/CreateLinkGroup/CreateLinkGroupDto";
import {UpdateLinkGroupDto} from "../UseCase/LinkGroup/UpdateLinkGroup/UpdateLinkGroupDto";



@Injectable()
export class LinkGroupRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findById(id: number) {
        return  this.prisma.linkGroup.findUnique({
            where: { id },
            include: {user: true},
        });
    }

    async findByUserId(userId: number): Promise<LinkGroup[]> {
        return this.prisma.linkGroup.findMany({
            where: {userId},
            include: {user: true},
        });
    }

    async findAll():Promise<LinkGroup[]> {
        return this.prisma.linkGroup.findMany({
            include: { user: true },
        });
    }

    async create(userId: number, dto: CreateLinkGroupDto): Promise<LinkGroup> {
        const data: Prisma.LinkGroupCreateInput = {
            name: dto.name,
            description: dto.description ?? null,
            user: {
                connect: { id: userId },
            },
            links: {
                create: [],
            },
        };

        return this.prisma.linkGroup.create({
            data,
        });
    }

    async update(linkGroupId: number, userId: number, dto: UpdateLinkGroupDto):Promise<LinkGroup> {
        const linkGroup = await this.prisma.linkGroup.findUnique({
            where: { id: linkGroupId },
        });
        if (!linkGroup) {
            throw new NotFoundException("LinkGroup with ID ${linkGroupId} not found");
        }

        if (linkGroup.userId !== userId) {
            throw new ForbiddenException('You do not have permission to update this link group');
        }
        console.log('Updating LinkGroup with data:', dto);
        const data: Prisma.LinkGroupUpdateInput = {
            name: dto.name,
            description: dto.description ?? null,
        }
        return this.prisma.linkGroup.update({
            where: { id: linkGroupId },
            data,
        });
    }

    async delete(linkGroupId: number, userId: number):Promise<LinkGroup> {
        const LinkGroup = await this.prisma.linkGroup.findUnique({
            where: { id: linkGroupId },
        });
        if (!LinkGroup) {
            throw new NotFoundException("LinkGroup with ID ${linkGroupId} not found");
        }

        if (LinkGroup.userId !== userId){
            throw new ForbiddenException('You do not have permission to delete this link group');
        }
        return this.prisma.linkGroup.delete({ where: { id: linkGroupId } });
    }
}