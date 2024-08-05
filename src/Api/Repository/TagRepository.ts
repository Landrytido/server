import { PrismaService } from "src/Core/Datasource/Prisma";
import SaveTagDto from "../Dto/SaveTagDto";
import { Injectable } from "@nestjs/common";
import { Tag } from "../Entity/Tag";
import { Prisma } from "@prisma/client";

@Injectable()
export default class TagRepository {
  constructor(private readonly prisma: PrismaService) {}


  async findById(tagId: number): Promise<Tag> {
    return await this.prisma.tag.findUnique({
      where: { id: tagId },
    });
  }

  async RemoveById(tagId: number): Promise<Tag> {
    return await this.prisma.tag.delete({
      where: { id: tagId },
    });
  }

  async UpdateById(tagId: number, dto: SaveTagDto): Promise<Tag> {
    return await this.prisma.tag.update({
      where: { id: tagId },
      data: {
        name: dto.name,
      },
    });
  }

  async save(
    data:
      | Prisma.XOR<Prisma.TagCreateInput, Prisma.TagUncheckedCreateInput>
      | Prisma.XOR<Prisma.TagUpdateInput, Prisma.TagUncheckedUpdateInput>
  ) {
    if (!data.id) {
      return await this.prisma.tag.create({
        data: data as Prisma.XOR<
          Prisma.TagCreateInput,
          Prisma.TagUncheckedCreateInput
        >,
      });
    }

    return await this.prisma.tag.update({
      where: {
        id: data.id as number,
      },
      data: data as Prisma.XOR<
        Prisma.TagUpdateInput,
        Prisma.TagUncheckedUpdateInput
      >,
    });
  }
}
