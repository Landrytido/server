import { Injectable } from "@nestjs/common";
import { ChronometerRepository } from "../../Repository/ChronometerRepository";
import Chronometer from "../../Entity/Chronometer";
import { ContextualGraphqlRequest } from "../../../index";

@Injectable()
export class GetCountdownUseCase {
  constructor(private chronometerRepository: ChronometerRepository) {}

  async handle(context: ContextualGraphqlRequest): Promise<Chronometer | null> {
    const userId = context.userId;
    return this.chronometerRepository.findLatestCountdownByUser(userId);
  }
}
