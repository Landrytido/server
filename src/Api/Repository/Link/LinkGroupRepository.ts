// src/Repository/Link/LinkGroupRepository.ts
import {Injectable} from '@nestjs/common';
import {PrismaService} from '../../../Core/Datasource/Prisma';
import {LinkGroup} from '@prisma/client';
import {SaveLinkGroupDto} from '../../Dto/LinkDto/SaveLinkGroupDto';

@Injectable()
export default class LinkGroupRepository {
    constructor(private readonly prisma: PrismaService) {
    }

    /**
     * Find a LinkGroup by its ID and include the related user and links.
     */
    async findById(id: string): Promise<LinkGroup> {
        return this.prisma.linkGroup.findUnique({
            where: {id},
            include: {user: true, links: {include: {link: true}}},
        });
    }

    /**
     * Retrieve all LinkGroups.
     */
    async findAll(): Promise<LinkGroup[]> {
        return this.prisma.linkGroup.findMany({
            include: {links: {include: {link: true}}},
        });
    }

    /**
     * Retrieve all LinkGroups associated with a given user.
     */
    async findByUserId(userId: number): Promise<LinkGroup[]> {
        return this.prisma.linkGroup.findMany({
            where: {userId},
            include: {
                user: true,
                // Include the join relation with its fields (linkName, clickCounter) and the embedded Link
                links: {
                    include: {
                        link: {
                            include : {
                                image : true
                            }
                        }
                    }
                }
            },
        });
    }

    /**
     * Create a new LinkGroup or update an existing one.
     * If dto.id is provided, it updates the LinkGroup; otherwise, it creates a new one.
     * Note: We include the relations so that the returned object matches the GraphQL type.
     */
    async save(userId: number, dto: SaveLinkGroupDto): Promise<LinkGroup> {
        if (dto.id) {
            return this.prisma.linkGroup.update({
                where: {id: dto.id},
                data: {
                    title: dto.title,
                    description: dto.description,
                },
                include: {user: true, links: {include: {link: true}}},
            });
        } else {
            return this.prisma.linkGroup.create({
                data: {
                    title: dto.title,
                    description: dto.description,
                    userId: userId,
                },
                include: {user: true, links: {include: {link: true}}},
            });
        }
    }

    /**
     * Delete a LinkGroup.
     * Processes each join relation (LinkGroupLink) to delete orphaned Links,
     * then deletes the LinkGroup, returning the deleted group with its relations.
     */
    async delete(id: string): Promise<LinkGroup> {
        return this.prisma.$transaction(async (tx) => {
            // Retrieve the LinkGroup along with its join relations.
            const group = await tx.linkGroup.findUnique({
                where: {id},
                include: {links: true},
            });
            if (!group) {
                throw new Error(`LinkGroup with id ${id} not found`);
            }

            // Process each join relation.
            for (const groupLink of group.links) {
                // Check if the Link is used in another group.
                const count = await tx.linkGroupLink.count({
                    where: {
                        linkId: groupLink.linkId,
                        linkGroupId: {not: group.id},
                    },
                });

                if (count === 0) {
                    // Delete the join relation for the current group.
                    await tx.linkGroupLink.delete({
                        where: {
                            linkGroupId_linkId: {
                                linkGroupId: group.id,
                                linkId: groupLink.linkId,
                            },
                        },
                    });
                    // Delete the Link as it is not referenced elsewhere.
                    await tx.link.delete({
                        where: {id: groupLink.linkId},
                    });
                }
            }

            // Finally, delete the LinkGroup and include the relations.
            return tx.linkGroup.delete({
                where: {id},
                include: {user: true, links: {include: {link: true}}},
            });
        });
    }
}
