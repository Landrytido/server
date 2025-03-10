import { Injectable, NotFoundException } from "@nestjs/common";
import { ChronometerRepository } from "../../Repository/ChronometerRepository";
import { ChronometerMode } from "@prisma/client";

@Injectable()
export class GetCurrentTimeUseCase {
  constructor(private chronometerRepository: ChronometerRepository) {}

  async execute(chronoId: string): Promise<number> {
    const chrono = await this.chronometerRepository.findById(chronoId);
    if (!chrono) {
      throw new NotFoundException("Chronomètre non trouvé.");
    }
    if (!chrono.isRunning) {
      return chrono.elapsedTime;
    }

    const currentTime =
      chrono.elapsedTime +
      Math.floor((new Date().getTime() - chrono.startTime.getTime()) / 1000);

    if (chrono.mode === ChronometerMode.COUNTDOWN && chrono.duration) {
      const remainingTime = Math.max(0, chrono.duration - currentTime);
      return remainingTime;
    }
    return currentTime;
  }
}