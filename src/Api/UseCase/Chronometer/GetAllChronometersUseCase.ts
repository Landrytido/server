import { Injectable } from "@nestjs/common";
import { ChronometerRepository } from "../../Repository/ChronometerRepository";
import Chronometer from "../../Entity/Chronometer";
import { ContextualGraphqlRequest } from "../../../index";

@Injectable()
export class GetAllChronometersUseCase {
  constructor(private chronometerRepository: ChronometerRepository) {}

  async handle(context: ContextualGraphqlRequest): Promise<Chronometer[]> {
    const userId = context.userId;
    return this.chronometerRepository.findStopwatchesByUser(userId);
  }
}
