import { PrismaService } from "../../Core/Datasource/Prisma";
import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";

@Injectable()
export default class LinkGroupRepository {
  constructor(private readonly prisma: PrismaService) {}
  async findById(id: number) {
    return this.prisma.linkGroup.findUnique({
      where: { id },
    });
  }

  async findByUserId(userId: number) {
    return this.prisma.linkGroup.findMany({
      where: { userId },
      include: {
        links: {
          include: {
            clicks: true,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.linkGroup.findMany();
  }

  async save(
    userId: number,
    data:
      | Prisma.XOR<
          Prisma.LinkGroupCreateInput,
          Prisma.LinkGroupUncheckedCreateInput
        >
      | Prisma.XOR<
          Prisma.LinkGroupUpdateInput,
          Prisma.LinkGroupUncheckedUpdateInput
        >
  ) {
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
    });
  }

  async delete(linkGroupId: number) {
    return this.prisma.linkGroup.delete({ where: { id: linkGroupId } });
  }
}
