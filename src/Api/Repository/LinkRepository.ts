import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../Core/Datasource/Prisma";
import { Prisma } from "@prisma/client";

@Injectable()
export default class LinkRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: number) {
    return this.prisma.link.findUnique({
      where: { id },
    });
  }

  async findByUserId(userId: number) {
    return this.prisma.link.findMany({
      where: { userId },
    });
  }

  async findByLinkGroupId(linkGroupId: number) {
    return this.prisma.link.findMany({
      where: { linkGroupId },
    });
  }

  async save(
    userId: number,
    data:
      | Prisma.XOR<Prisma.LinkCreateInput, Prisma.LinkUncheckedCreateInput>
      | Prisma.XOR<Prisma.LinkUpdateInput, Prisma.LinkUncheckedUpdateInput>,
  ) {
    if (!data.id) {
      return this.prisma.link.create({
        data: {
          name: data.name as string,
          description: data.description as string | null,
          url: data.url as string,
          linkGroup: {
            connect: { id: data.linkGroupId as number },
          },
          user: {
            connect: { id: userId },
          },
        },
      });
    }

    return this.prisma.link.update({
      where: { id: data.id as number },
      data: {
        name: data.name as string,
        description: data.description as string,
        url: data.url as string,
      },
    });
  }

  async delete(id: number) {
    return this.prisma.link.delete({ where: { id: +id } });
  }

  async findLinksByUserIdWithMinClicks(userId: number, minClicks: number) {
    return this.prisma.link.findMany({
      where: {
        userId: userId,
        clicks: {
          some: {
            clicks: {
              gte: minClicks,
            },
          },
        },
      },
    });
  }
}
