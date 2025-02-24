import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../../Core/Datasource/Prisma";
import { Chronometer } from "@prisma/client";

@Injectable()
export class ChronometerService {
  constructor(private prisma: PrismaService) {}

  async start(
    userId: number,
    mode: "countdown" | "stopwatch",
    duration?: number,
  ): Promise<Chronometer> {
    console.log("toto", userId, mode, duration);
    const existingChrono = await this.prisma.chronometer.findFirst({
      where: { userId },
    });

    if (existingChrono) {
      console.log("existingChrono", existingChrono);
      return this.prisma.chronometer.update({
        where: { id: existingChrono.id },
        data: {
          isRunning: true,
        },
      });
    }
    console.log("newChrono");

    return this.prisma.chronometer.create({
      data: {
        userId,
        startTime: new Date(),
        isRunning: true,
        mode,
        duration: mode === "countdown" ? duration : null,
        elapsedTime: 0,
      },
    });
  }

  async stop(userId: number): Promise<Chronometer> {
    const chrono = await this.prisma.chronometer.findFirst({
      where: { userId, isRunning: true },
    });

    if (!chrono) {
      throw new NotFoundException(
        "Aucun chronomètre en cours pour cet utilisateur.",
      );
    }

    const elapsedTime = new Date().getTime() - chrono.startTime.getTime();

    return this.prisma.chronometer.update({
      where: { id: chrono.id },
      data: {
        isRunning: false,
        elapsedTime,
      },
    });
  }

  async reset(userId: number): Promise<Chronometer> {
    const chrono = await this.prisma.chronometer.findFirst({
      where: { userId },
    });

    if (!chrono) {
      throw new NotFoundException(
        "Aucun chronomètre trouvé pour cet utilisateur.",
      );
    }

    return await this.prisma.chronometer.delete({ where: { id: chrono.id } });

    //   return this.prisma.chronometer.update({
    //     where: { id: chrono.id },
    //     data: {
    //       startTime: null,
    //       isRunning: false,
    //       elapsedTime: 0,
    //     },
    //   });
  }

  async getChronometer(userId: number): Promise<Chronometer | null> {
    return this.prisma.chronometer.findFirst({
      where: { userId },
    });
  }
}
