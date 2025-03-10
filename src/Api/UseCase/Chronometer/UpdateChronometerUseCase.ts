import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { ChronometerRepository } from "../../Repository/ChronometerRepository";
import Chronometer from "../../Entity/Chronometer";
import { UpdateChronometerDto } from "../../Dto/UpdateChronometerDto";
import { ChronometerMode } from "@prisma/client";

@Injectable()
export class UpdateChronometerUseCase {
  constructor(private chronometerRepository: ChronometerRepository) {}

  async execute(
    userId: number,
    id: string,
    updateData: UpdateChronometerDto
  ): Promise<Chronometer> {
    const chrono = await this.chronometerRepository.findByUserAndId(userId, id);
    if (!chrono) {
      throw new NotFoundException(
        "Aucun chronomètre trouvé pour cet utilisateur."
      );
    }
    if (
      updateData.mode === ChronometerMode.COUNTDOWN ||
      (chrono.mode === ChronometerMode.COUNTDOWN &&
        updateData.duration !== undefined)
    ) {
      if (updateData.duration !== undefined && updateData.duration <= 0) {
        throw new BadRequestException(
          "La durée du compte à rebours doit être positive."
        );
      }
    }

    if (
      chrono.mode === ChronometerMode.STOPWATCH &&
      updateData.mode === ChronometerMode.COUNTDOWN &&
      updateData.duration === undefined
    ) {
      throw new BadRequestException(
        "Une durée est requise pour le mode compte à rebours."
      );
    }

    return this.chronometerRepository.update(chrono.id, updateData);
  }
}
