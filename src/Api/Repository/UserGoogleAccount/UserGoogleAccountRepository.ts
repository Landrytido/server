import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../Core/Datasource/Prisma";
import { UserGoogleAccount } from "@prisma/client";

@Injectable()
export default class UserGoogleAccountRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByUserId(userId: number): Promise<UserGoogleAccount[]> {
    return this.prisma.userGoogleAccount.findMany({
      where: { userId },
      orderBy: { isDefault: "desc" },
    });
  }

  async findByUserIdAndEmail(
    userId: number,
    email: string
  ): Promise<UserGoogleAccount | null> {
    return this.prisma.userGoogleAccount.findUnique({
      where: {
        userId_email: {
          userId,
          email,
        },
      },
    });
  }

  async create(
    userId: number,
    email: string,
    accessToken: string,
    refreshToken: string,
    isDefault: boolean = false
  ): Promise<UserGoogleAccount> {
    if (isDefault) {
      await this.prisma.userGoogleAccount.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    return this.prisma.userGoogleAccount.create({
      data: {
        userId,
        email,
        accessToken,
        refreshToken,
        isDefault,
      },
    });
  }

  async setDefault(userId: number, email: string): Promise<UserGoogleAccount> {
    await this.prisma.userGoogleAccount.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    });

    return this.prisma.userGoogleAccount.update({
      where: {
        userId_email: {
          userId,
          email,
        },
      },
      data: { isDefault: true },
    });
  }

  async delete(userId: number, email: string): Promise<UserGoogleAccount> {
    const account = await this.findByUserIdAndEmail(userId, email);

    if (account && account.isDefault) {
      const otherAccount = await this.prisma.userGoogleAccount.findFirst({
        where: { userId, email: { not: email } },
      });

      if (otherAccount) {
        await this.setDefault(userId, otherAccount.email);
      }
    }

    return this.prisma.userGoogleAccount.delete({
      where: {
        userId_email: {
          userId,
          email,
        },
      },
    });
  }

  async updateTokens(
    userId: number,
    email: string,
    accessToken: string,
    refreshToken?: string
  ): Promise<UserGoogleAccount> {
    return this.prisma.userGoogleAccount.update({
      where: {
        userId_email: {
          userId,
          email,
        },
      },
      data: {
        accessToken,
        ...(refreshToken ? { refreshToken } : {}),
      },
    });
  }
}
