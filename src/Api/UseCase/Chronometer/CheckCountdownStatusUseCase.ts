import { Injectable } from "@nestjs/common";
import { ChronometerRepository } from "../../Repository/ChronometerRepository";
import { ChronometerMode } from "@prisma/client";
import { ContextualGraphqlRequest } from "src";

@Injectable()
export class CheckCountdownStatusUseCase {
  constructor(private chronometerRepository: ChronometerRepository) {}
  async handle(
    context: ContextualGraphqlRequest,
    chronoId: string
  ): Promise<boolean> {
    const chrono = await this.chronometerRepository.findById(chronoId);

    if (
      !chrono ||
      chrono.mode !== ChronometerMode.COUNTDOWN ||
      !chrono.isRunning ||
      !chrono.startTime ||
      !chrono.duration
    ) {
      return false;
    }

    const elapsedSeconds =
      chrono.elapsedTime +
      Math.floor((new Date().getTime() - chrono.startTime.getTime()) / 1000);

    return elapsedSeconds >= chrono.duration;
  }
}
