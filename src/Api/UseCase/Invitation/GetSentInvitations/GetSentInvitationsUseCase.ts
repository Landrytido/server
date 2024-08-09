import { ContextualGraphqlRequest, UseCase } from "../../../../index";
import { BadRequestException, Injectable } from "@nestjs/common";
import InvitationRepository from "../../../Repository/InvitationRepository";
import { Invitation } from "@prisma/client";

@Injectable()
export default class GetSentInvitationsUseCase
  implements UseCase<Promise<Invitation[]>, []>
{
  constructor(private readonly invitationRepository: InvitationRepository) {}

  async handle(context: ContextualGraphqlRequest) {
    try {
      return await this.invitationRepository.findSentInvitations(
        context.userId
      );
    } catch (error) {
      throw new BadRequestException(
        "GetSentInvitationsUseCaseFailed",
        error.message
      );
    }
  }
}
