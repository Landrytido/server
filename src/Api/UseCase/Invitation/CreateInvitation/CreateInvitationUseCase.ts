import SaveInvitationDto from "./SaveInvitationDto";
import { ContextualGraphqlRequest, UseCase } from "../../../../index";
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import InvitationRepository from "../../../Repository/InvitationRepository";
import { Invitation } from "@prisma/client";

@Injectable()
export default class CreateInvitationUseCase
  implements UseCase<Promise<Invitation>, [dto: SaveInvitationDto]>
{
  constructor(private readonly invitationRepository: InvitationRepository) {}

  async handle(context: ContextualGraphqlRequest, dto: SaveInvitationDto) {
    try {
      const receiver = await this.invitationRepository.findReceiverIdByEmail(
        dto.email
      );

      if (!receiver) throw new NotFoundException("User not found");

      if (receiver.id == context.userId)
        throw new BadRequestException(
          "Users are prohibited from sending invitations to themselves"
        );

      const invitation =
        await this.invitationRepository.findInvitationBySenderAndReceiver(
          context.userId,
          receiver.id
        );

      if (invitation)
        throw new BadRequestException(
          "You've already sent an invitation to this user"
        );

      return await this.invitationRepository.save({
        receiverId: receiver.id,
        senderId: context.userId,
      });
    } catch (error) {
      throw new BadRequestException(
        "CreateInvitationUseCaseFailed",
        error.message
      );
    }
  }
}
