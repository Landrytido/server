import { Injectable, NotFoundException } from "@nestjs/common";
import { ChronometerRepository } from "../../Repository/ChronometerRepository";
import Chronometer from "../../Entity/Chronometer";

@Injectable()
export class StopChronometerUseCase {
  constructor(private chronometerRepository: ChronometerRepository) {}

  async execute(userId: number, id: string): Promise<Chronometer> {
    const chrono = await this.chronometerRepository.findRunningByUserAndId(
      userId,
      id
    );
    if (!chrono) {
      throw new NotFoundException(
        "Aucun chronomètre en cours pour cet utilisateur."
      );
    }
    const elapsedTime =
      chrono.elapsedTime +
      Math.floor((new Date().getTime() - chrono.startTime.getTime()) / 1000);
    return this.chronometerRepository.update(chrono.id, {
      isRunning: false,
      elapsedTime,
    });
  }
}
