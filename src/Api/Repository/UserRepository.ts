import {Injectable} from "@nestjs/common";
import {PrismaService} from "../../Core/Datasource/Prisma";
import {Prisma} from "@prisma/client";
import Bcrypt from "../../Core/Security/Service/encryption/Bcrypt";

@Injectable()
export default class UserRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly bcrypt: Bcrypt
  ) {}

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

  async create(dto: Prisma.XOR<Prisma.UserCreateInput, Prisma.UserUncheckedCreateInput>) {
    const hashedPassword = await this.bcrypt.hash(dto.password);
    return this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        firstName: dto.firstName,
        lastName: dto.lastName
      }
    });
  }

  async save(data: Prisma.XOR<Prisma.UserUpdateInput, Prisma.UserUncheckedUpdateInput>) {
    return this.prisma.user.update({
      where: { id: data.id as number },
      data: data as Prisma.XOR<Prisma.UserUpdateInput, Prisma.UserUncheckedUpdateInput>
    });
  }
}