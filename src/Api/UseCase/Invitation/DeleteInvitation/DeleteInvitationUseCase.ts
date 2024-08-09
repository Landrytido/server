import { BadRequestException, Injectable } from "@nestjs/common";
import { ContextualGraphqlRequest, UseCase } from "../../../../index";

import InvitationRepository from "../../../Repository/InvitationRepository";
import { Invitation } from "@prisma/client";

@Injectable()
export default class DeleteInvitationUseCase
  implements UseCase<Promise<Invitation>, [invitationId: number]>
{
  constructor(private readonly invitationRepository: InvitationRepository) {}

  async handle(context: ContextualGraphqlRequest, invitationId: number) {
    try {
      return await this.invitationRepository.remove(invitationId);
    } catch (error) {
      throw new BadRequestException(
        "DeleteInvitationUseCaseFailed",
        error.message
      );
    }
  }
}
