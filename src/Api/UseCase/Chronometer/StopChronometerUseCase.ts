import { Injectable, NotFoundException } from "@nestjs/common";
import { ChronometerRepository } from "../../Repository/ChronometerRepository";
import Chronometer from "../../Entity/Chronometer";

@Injectable()
export class StopChronometerUseCase {
  constructor(private chronometerRepository: ChronometerRepository) {}

  async execute(userId: number, id: string): Promise<Chronometer> {
    // Récupérer le chronomètre en cours d'exécution
    const chrono = await this.chronometerRepository.findRunningByUserAndId(userId, id);
    if (!chrono) {
      throw new NotFoundException(
        "Aucun chronomètre en cours pour cet utilisateur."
      );
    }

    // Calculer le temps écoulé
    const elapsedTime =
      chrono.elapsedTime +
      Math.floor((new Date().getTime() - chrono.startTime.getTime()) / 1000);

    // Mettre à jour le chronomètre
    return this.chronometerRepository.update(chrono.id, {
      isRunning: false,
      elapsedTime,
    });
  }
}