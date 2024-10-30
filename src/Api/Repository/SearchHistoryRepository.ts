import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/Core/Datasource/Prisma";
import { Prisma } from "@prisma/client";

@Injectable()
export default class SearchHistoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(historyId: number) {
    return await this.prisma.searchHistory.findUnique({
      where: { id: historyId },
      include: { user: true },
    });
  }

  async findByUserId(userId: number) {
    return await this.prisma.searchHistory.findMany({
      where: { userId },
      include: { user: true },
      orderBy: {
        searchDate: 'desc',
      },
    });
  }

  async findMany() {
    return await this.prisma.searchHistory.findMany({
      include: { user: true },
    });
  }

  async save(
    data:
      | Prisma.XOR<Prisma.SearchHistoryCreateInput, Prisma.SearchHistoryUncheckedCreateInput>
      | Prisma.XOR<Prisma.SearchHistoryUpdateInput, Prisma.SearchHistoryUncheckedUpdateInput>
  ) {
    if (!data.id) {
      return await this.prisma.searchHistory.create({
        data: data as Prisma.XOR<
          Prisma.SearchHistoryCreateInput,
          Prisma.SearchHistoryUncheckedCreateInput
        >,
        include: { user: true },
      });
    }

    return await this.prisma.searchHistory.update({
      where: { id: data.id as number },
      data: data as Prisma.XOR<
        Prisma.SearchHistoryUpdateInput,
        Prisma.SearchHistoryUncheckedUpdateInput
      >,
      include: { user: true },
    });
  }

  async remove(historyId: number) {
    return this.prisma.searchHistory.delete({
      where: { id: historyId },
    });
  }
}