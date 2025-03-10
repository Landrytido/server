import { Injectable } from "@nestjs/common";
import { ChronometerRepository } from "../../Repository/ChronometerRepository";
import Chronometer from "../../Entity/Chronometer";

@Injectable()
export class GetAllChronometersUseCase {
  constructor(private chronometerRepository: ChronometerRepository) {}

  async execute(userId: number): Promise<Chronometer[]> {
    return this.chronometerRepository.findStopwatchesByUser(userId);
  }
}
