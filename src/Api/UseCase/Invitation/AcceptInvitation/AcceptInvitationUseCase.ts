import { ContextualGraphqlRequest, UseCase } from "../../../../index";
import { BadRequestException, Injectable } from "@nestjs/common";
import InvitationRepository from "../../../Repository/InvitationRepository";
import { Invitation } from "@prisma/client";

@Injectable()
export default class AcceptInvitationUseCase
  implements UseCase<Promise<Invitation>, [invitationId: number]>
{
  constructor(private readonly invitationRepository: InvitationRepository) {}

  async handle(context: ContextualGraphqlRequest, invitationId: number) {
    try {
      return await this.invitationRepository.acceptInvitation(invitationId);
    } catch (error) {
      throw new BadRequestException(
        "AcceptInvitationUseCaseFailed",
        error.message
      );
    }
  }
}
