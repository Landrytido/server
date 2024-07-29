import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../Core/Datasource/Prisma';
import { Prisma, Meet } from '@prisma/client';

@Injectable()
export default class MeetRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: number): Promise<Meet | null> {
    return this.prisma.meet.findUnique({
      where: { id },
    });
  }

  async create(data: Prisma.MeetCreateInput): Promise<Meet> {
    return this.prisma.meet.create({
      data,
    });
  }

  async update(id: number, data: Prisma.MeetUpdateInput): Promise<Meet> {
    return this.prisma.meet.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<Meet> {
    return this.prisma.meet.delete({
      where: { id },
    });
  }

  async findAll(): Promise<Meet[]> {
    return this.prisma.meet.findMany();
  }
}
