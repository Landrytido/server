import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { ChronometerRepository } from "../../Repository/ChronometerRepository";
import Chronometer from "../../Entity/Chronometer";
import { ChronometerMode } from "@prisma/client";
import { ContextualGraphqlRequest, UseCase } from "../../../index";
import { StartChronometerDto } from "../../Dto/ChronoDto/StartChronometerDto";

@Injectable()
export class StartChronometerUseCase
  implements UseCase<Promise<Chronometer>, [StartChronometerDto]>
{
  constructor(private chronometerRepository: ChronometerRepository) {}

  async handle(
    context: ContextualGraphqlRequest,
    dto: StartChronometerDto
  ): Promise<Chronometer> {
    try {
      const userId = context.userId;
      const { name, mode, duration } = dto;

      const userExists = await this.chronometerRepository.userExists(userId);
      if (!userExists) {
        throw new NotFoundException("Utilisateur non trouvé.");
      }

      if (mode === ChronometerMode.COUNTDOWN) {
        const existingCountdown =
          await this.chronometerRepository.findRunningCountdownByUser(userId);
        if (existingCountdown) {
          throw new BadRequestException(
            "Un compte à rebours est déjà en cours pour cet utilisateur."
          );
        }

        if (duration === undefined || duration <= 0) {
          throw new BadRequestException(
            "La durée du compte à rebours doit être positive."
          );
        }
      }

      return this.chronometerRepository.create({
        userId,
        name,
        mode,
        startTime: new Date(),
        isRunning: true,
        duration: mode === ChronometerMode.COUNTDOWN ? duration : null,
        elapsedTime: 0,
      });
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException(
        "Échec de la création du chronomètre",
        error.message
      );
    }
  }
}
