import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../Core/Datasource/Prisma";

@Injectable()
export default class LinkClickRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: number) {
    return this.prisma.linkClick.findUnique({
      where: { id },
    });
  }

  async findByLinkId(linkId: number) {
    return this.prisma.linkClick.findMany({
      where: { linkId },
    });
  }

  async findByUserId(userId: number) {
    return this.prisma.linkClick.findMany({
      where: { userId },
      orderBy: {
        clicks: 'desc',
      },
    });
  }

  async delete(id: number) {
    return this.prisma.linkClick.delete({ where: { id: +id } });
  }

  async saveClicks(linkId: number, userId: number) {
    const existingLinkClick = await this.prisma.linkClick.findFirst({
      where: { linkId, userId },
    });

    if (existingLinkClick) {
      return this.prisma.linkClick.update({
        where: { id: existingLinkClick.id },
        data: {
          clicks: existingLinkClick.clicks + 1,
        },
      });
    }

    return this.prisma.linkClick.create({
      data: {
        link: { connect: { id: linkId } },
        user: { connect: { id: userId } },
        clicks: 1,
      },
    });
  }
}
