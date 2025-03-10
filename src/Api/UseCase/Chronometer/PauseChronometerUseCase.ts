import { Injectable, NotFoundException } from "@nestjs/common";
import { ChronometerRepository } from "../../Repository/ChronometerRepository";
import Chronometer from "../../Entity/Chronometer";
import { ContextualGraphqlRequest } from "../../../index";

@Injectable()
export class PauseChronometerUseCase {
  constructor(private chronometerRepository: ChronometerRepository) {}

  async handle(
    context: ContextualGraphqlRequest,
    id: string
  ): Promise<Chronometer> {
    const userId = context.userId;
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
