import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../Core/Datasource/Prisma";
import { Prisma } from "@prisma/client";
import Bcrypt from "../../Core/Security/Service/encryption/Bcrypt";

@Injectable()
export default class UserRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly bcrypt: Bcrypt
  ) {}

  async getAll() {
      return this.prisma.user.findMany();
  }

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
    let hashedPassword = null;
    if (dto.password) {
      hashedPassword = await this.bcrypt.hash(dto.password);
    }
    return this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        firstName: dto.firstName,
        lastName: dto.lastName,
        lastLoginDate: new Date()
      }
    });
  }

  async save(data: Prisma.XOR<Prisma.UserUpdateInput, Prisma.UserUncheckedUpdateInput>) {
    return this.prisma.user.update({
      where: { id: data.id as number },
      data: data as Prisma.XOR<Prisma.UserUpdateInput, Prisma.UserUncheckedUpdateInput>
    });
  }

  /**
   * Vérifie si l’utilisateur est connecté via Google.
   * Ici, nous considérons que si `password` est null, l’utilisateur s’est inscrit via Google.
   */
  async hasGoogleAuth(userId: number): Promise<boolean> {
    const user = await this.findById(userId);
    return user && user.password === null;
  }
}
