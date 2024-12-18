import { ContextualGraphqlRequest, UseCase } from "../../../../index";
import { BadRequestException, Injectable } from "@nestjs/common";
import InvitationRepository from "../../../Repository/InvitationRepository";
import { Invitation } from "@prisma/client";

@Injectable()
export default class GetReceivedInvitationsUseCase
  implements UseCase<Promise<Invitation[]>, []>
{
  constructor(private readonly invitationRepository: InvitationRepository) {}

  async handle(context: ContextualGraphqlRequest) {
    try {
      const result = await this.invitationRepository.findReceivedInvitations(
        context.userId
      );
      return result;
    } catch (error) {
      throw new BadRequestException(
        "GetRecievedInvitationsUseCaseFailed",
        error.message
      );
    }
  }
}
