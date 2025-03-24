import { Injectable, NotFoundException } from "@nestjs/common";
import { ChronometerRepository } from "../../Repository/ChronometerRepository";
import Chronometer from "../../Entity/Chronometer";
import { ContextualGraphqlRequest } from "../../../index";

@Injectable()
export class GetChronometerUseCase {
  constructor(private chronometerRepository: ChronometerRepository) {}

  async handle(
    context: ContextualGraphqlRequest,
    id: string
  ): Promise<Chronometer | null> {
    const userId = context.userId;
    const chrono = await this.chronometerRepository.findByUserAndId(userId, id);
    if (!chrono) {
      throw new NotFoundException("Chronomètre non trouvé.");
    }
    return chrono;
  }
}
