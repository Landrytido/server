import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { ChronometerRepository } from "../../Repository/ChronometerRepository";
import Chronometer from "../../Entity/Chronometer";
import { ChronometerMode } from "@prisma/client";

@Injectable()
export class StartChronometerUseCase {
  constructor(private chronometerRepository: ChronometerRepository) {}

  async execute(
    userId: number,
    name: string,
    mode: ChronometerMode,
    duration?: number
  ): Promise<Chronometer> {
    // Vérifier si l'utilisateur existe
    const userExists = await this.chronometerRepository.userExists(userId);
    if (!userExists) {
      throw new NotFoundException("Utilisateur non trouvé.");
    }

    // Validation spécifique pour le mode COUNTDOWN
    if (mode === ChronometerMode.COUNTDOWN) {
      // Vérifier qu'il n'y a pas déjà un compte à rebours en cours
      const existingCountdown = await this.chronometerRepository.findRunningCountdownByUser(userId);
      if (existingCountdown) {
        throw new BadRequestException(
          "Un compte à rebours est déjà en cours pour cet utilisateur."
        );
      }
      
      // Vérifier que la durée est valide
      if (duration === undefined || duration <= 0) {
        throw new BadRequestException(
          "La durée du compte à rebours doit être positive."
        );
      }
    }

    // Créer le nouveau chronomètre
    return this.chronometerRepository.create({
      userId,
      name,
      mode,
      startTime: new Date(),
      isRunning: true,
      duration: mode === ChronometerMode.COUNTDOWN ? duration : null,
      elapsedTime: 0,
    });
  }
}