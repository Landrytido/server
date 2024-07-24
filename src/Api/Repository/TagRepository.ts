import { PrismaService } from "src/Core/Datasource/Prisma";
import { SaveTagDto } from "../Dto/SaveTagDto";
import { Injectable } from "@nestjs/common";
import { Tag } from "../Entity/Tag";

@Injectable()
export default class TagRepository {
  update(tag: Tag): any {
      throw new Error("Method not implemented.");
  }
  constructor(private readonly prisma: PrismaService) {}

  create(data: SaveTagDto) {
    return this.prisma.tag.create({
      data: {
        name: data.name,
      },
    });
  }

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

  async UpdateById(tagId: number , dto:SaveTagDto): Promise<Tag>{
    return await this.prisma.tag.update({
      where: { id: tagId },
      data: {
        name : dto.name
      }
    });
  }
    
}




 


