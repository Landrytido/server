import { Injectable, NotFoundException } from "@nestjs/common";
import { ChronometerRepository } from "../../Repository/ChronometerRepository";
import Chronometer from "../../Entity/Chronometer";
import { ContextualGraphqlRequest } from "src";

@Injectable()
export class DeleteChronometerUseCase {
  constructor(private chronometerRepository: ChronometerRepository) {}

  async handle(
    context: ContextualGraphqlRequest,
    id: string
  ): Promise<Chronometer> {
    const userId = context.userId;
    const chrono = await this.chronometerRepository.findByUserAndId(userId, id);
    if (!chrono) {
      throw new NotFoundException(
        "Aucun chronomètre trouvé pour cet utilisateur."
      );
    }

    return this.chronometerRepository.delete(chrono.id);
  }
}
