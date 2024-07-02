import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../Core/Datasource/Prisma';
import { Prisma } from "@prisma/client";

@Injectable()
export default class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async saveUser(data: Prisma.XOR<Prisma.UserCreateInput, Prisma.UserUncheckedCreateInput> | Prisma.XOR<Prisma.UserUpdateInput, Prisma.UserUncheckedUpdateInput>) {
    if (!data.id) {
      return this.prisma.user.create({
        data: data as Prisma.XOR<Prisma.UserCreateInput, Prisma.UserUncheckedCreateInput>
      });
    }

    return this.prisma.user.update({
      where: { id: data.id as number },
      data: data as Prisma.XOR<Prisma.UserUpdateInput, Prisma.UserUncheckedUpdateInput>
    });
  }
}
