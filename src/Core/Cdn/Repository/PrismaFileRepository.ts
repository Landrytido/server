import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../Datasource/Prisma';
import { Prisma } from '@prisma/client';
@Injectable()
export default class PrismaFileRepository {
  constructor(private readonly prisma: PrismaService) {}
  async findById(id: number) {
    return this.prisma.file.findUnique({ where: { id } });
  }
  async delete(id: number) {
    return this.prisma.file.delete({ where: { id } });
  }
  save(data: Prisma.XOR<Prisma.FileCreateInput, Prisma.FileUncheckedCreateInput>|Prisma.XOR<Prisma.FileUpdateInput, Prisma.FileUncheckedUpdateInput>) {
    if (!data.id) {
      return this.prisma.file.create({ data: data as Prisma.XOR<Prisma.FileCreateInput, Prisma.FileUncheckedCreateInput> });
    }
    return this.prisma.file.update({
      where: {
        id: data.id as number,
      },
      data: data as Prisma.XOR<Prisma.FileUpdateInput, Prisma.FileUncheckedUpdateInput>,
    });
  }
  async create(data: Prisma.XOR<Prisma.FileCreateInput, Prisma.FileUncheckedCreateInput>) {
    return this.prisma.file.create({
      data
    });
  }
}