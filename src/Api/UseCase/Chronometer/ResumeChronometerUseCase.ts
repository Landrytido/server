import { Injectable, NotFoundException } from "@nestjs/common";
import { ChronometerRepository } from "../../Repository/ChronometerRepository";
import Chronometer from "../../Entity/Chronometer";

@Injectable()
export class ResumeChronometerUseCase {
  constructor(private chronometerRepository: ChronometerRepository) {}

  async execute(userId: number, id: string): Promise<Chronometer> {
    const chrono = await this.chronometerRepository.findPausedByUserAndId(userId, id);
    if (!chrono) {
      throw new NotFoundException("Aucun chronomètre en pause trouvé.");
    }

    return this.chronometerRepository.update(chrono.id, {
      startTime: new Date(),
      isRunning: true,
    });
  }
}