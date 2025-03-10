import { Injectable, NotFoundException } from "@nestjs/common";
import { ChronometerRepository } from "../../Repository/ChronometerRepository";
import Chronometer from "../../Entity/Chronometer";

@Injectable()
export class ResetChronometerUseCase {
  constructor(private chronometerRepository: ChronometerRepository) {}

  async execute(userId: number, id: string): Promise<Chronometer> {
    const chrono = await this.chronometerRepository.findByUserAndId(userId, id);
    if (!chrono) {
      throw new NotFoundException(
        "Aucun chronomètre trouvé pour cet utilisateur."
      );
    }
    return this.chronometerRepository.update(chrono.id, {
      startTime: null,
      isRunning: false,
      elapsedTime: 0,
    });
  }
}
