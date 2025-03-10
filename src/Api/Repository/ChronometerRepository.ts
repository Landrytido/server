import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../Core/Datasource/Prisma";
import Chronometer from "../Entity/Chronometer";
import { ChronometerMode } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { Chronometer as PrismaChronometer } from "@prisma/client";

@Injectable()
export class ChronometerRepository {
  constructor(private prisma: PrismaService) {}
  private mapToEntity(prismaChronometer: PrismaChronometer): Chronometer {
    return {
      id: prismaChronometer.id,
      name: prismaChronometer.name,
      mode: prismaChronometer.mode,
      startTime: prismaChronometer.startTime,
      elapsedTime: prismaChronometer.elapsedTime,
      duration: prismaChronometer.duration,
      isRunning: prismaChronometer.isRunning,
      userId: prismaChronometer.userId,
    };
  }
  async create(data: {
    userId: number;
    name: string;
    mode: ChronometerMode;
    startTime: Date | null;
    elapsedTime: number;
    duration: number | null;
    isRunning: boolean;
  }): Promise<Chronometer> {
    const result = await this.prisma.chronometer.create({
      data,
    });
    return this.mapToEntity(result);
  }

  async findById(id: string): Promise<Chronometer | null> {
    const result = await this.prisma.chronometer.findUnique({
      where: { id },
    });
    return result ? this.mapToEntity(result) : null;
  }

  async findByUserAndId(
    userId: number,
    id: string
  ): Promise<Chronometer | null> {
    const result = await this.prisma.chronometer.findFirst({
      where: { userId, id },
    });
    return result ? this.mapToEntity(result) : null;
  }

  async findRunningByUserAndId(
    userId: number,
    id: string
  ): Promise<Chronometer | null> {
    const result = await this.prisma.chronometer.findFirst({
      where: { userId, id, isRunning: true },
    });
    return result ? this.mapToEntity(result) : null;
  }

  async findPausedByUserAndId(
    userId: number,
    id: string
  ): Promise<Chronometer | null> {
    const result = await this.prisma.chronometer.findFirst({
      where: { userId, id, isRunning: false },
    });
    return result ? this.mapToEntity(result) : null;
  }

  async findAllByUser(userId: number): Promise<Chronometer[]> {
    const results = await this.prisma.chronometer.findMany({
      where: { userId },
    });
    return results.map((result) => this.mapToEntity(result));
  }
  async findStopwatchesByUser(userId: number): Promise<Chronometer[]> {
    const results = await this.prisma.chronometer.findMany({
      where: { userId, mode: ChronometerMode.STOPWATCH },
    });
    return results.map((result) => this.mapToEntity(result));
  }

  async findLatestCountdownByUser(userId: number): Promise<Chronometer | null> {
    const result = await this.prisma.chronometer.findFirst({
      where: { userId, mode: ChronometerMode.COUNTDOWN },
      orderBy: { startTime: "desc" },
    });
    return result ? this.mapToEntity(result) : null;
  }
  async findRunningCountdownByUser(
    userId: number
  ): Promise<Chronometer | null> {
    const result = await this.prisma.chronometer.findFirst({
      where: {
        userId,
        mode: ChronometerMode.COUNTDOWN,
        isRunning: true,
      },
    });
    return result ? this.mapToEntity(result) : null;
  }

  async update(
    id: string,
    data: Prisma.ChronometerUpdateInput
  ): Promise<Chronometer> {
    const result = await this.prisma.chronometer.update({
      where: { id },
      data,
    });
    return this.mapToEntity(result);
  }
  async delete(id: string): Promise<Chronometer> {
    const result = await this.prisma.chronometer.delete({
      where: { id },
    });
    return this.mapToEntity(result);
  }

  async userExists(userId: number): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });
    return !!user;
  }
}
