import { Injectable } from "@nestjs/common";
import { ChronometerRepository } from "../../Repository/ChronometerRepository";
import Chronometer from "../../Entity/Chronometer";

@Injectable()
export class GetCountdownUseCase {
  constructor(private chronometerRepository: ChronometerRepository) {}

  async execute(userId: number): Promise<Chronometer | null> {
    return this.chronometerRepository.findLatestCountdownByUser(userId);
  }
}
