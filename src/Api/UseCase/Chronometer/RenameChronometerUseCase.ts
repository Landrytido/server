import { Injectable, NotFoundException } from "@nestjs/common";
import { ChronometerRepository } from "../../Repository/ChronometerRepository";
import Chronometer from "../../Entity/Chronometer";
import { ContextualGraphqlRequest } from "../../../index";
import { RenameChronometerDto } from "../../Dto/ChronoDto/RenameChronometerDto";

@Injectable()
export class RenameChronometerUseCase {
  constructor(private chronometerRepository: ChronometerRepository) {}

  async handle(
    context: ContextualGraphqlRequest,
    dto: RenameChronometerDto
  ): Promise<Chronometer> {
    const userId = context.userId;
    const { id, newName } = dto;

    const chrono = await this.chronometerRepository.findByUserAndId(userId, id);
    if (!chrono) {
      throw new NotFoundException(
        "Aucun chronomètre trouvé pour cet utilisateur."
      );
    }

    return this.chronometerRepository.update(chrono.id, {
      name: newName,
    });
  }
}
