import SaveInvitationDto from "./SaveInvitationDto";
import { ContextualGraphqlRequest, UseCase } from "../../../../index";
import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import InvitationRepository from "../../../Repository/InvitationRepository";
import { Invitation } from "@prisma/client";
import { EmailService } from "src/Api/Services/emailService";
import Authenticator from "src/Core/Security/Service/authentication/Authenticator";

@Injectable()
export default class CreateInvitationUseCase
  implements UseCase<Promise<Invitation>, [dto: SaveInvitationDto]>
{
  constructor(
    private readonly invitationRepository: InvitationRepository,
    private readonly emailService: EmailService,
    @Inject("Authenticator") private authenticator: Authenticator
  ) {}

  async handle(context: ContextualGraphqlRequest, dto: SaveInvitationDto) {
    try {
      const receiver = await this.invitationRepository.findReceiverIdByEmail(
        dto.email
      );

      //external invitation logic
      if (receiver == null) {
        const token = await this.authenticator.createToken({
          email: dto.email,
          userId: context.userId,
        });

        const savedInvitation = await this.invitationRepository.save({
          externalEmailInvitation: dto.email,
          senderId: context.userId,
          tokenForExternalInvitation: token,
          isExternal: true,
        });

        const invitationLink = `${process.env.FRONTEND_URL}/external-invitation?token=${token}`;

        await this.emailService.sendInvitationEmail(
          dto.email,
          context.userId,
          invitationLink
        );

        return savedInvitation;
      }

      //internal invitation logic
      if (receiver) {
        if (receiver.id == context.userId)
          throw new BadRequestException(
            "Users are prohibited from sending invitations to themselves"
          );

        const existingInvitation =
          await this.invitationRepository.findInvitationBySenderAndReceiver(
            context.userId,
            receiver.id
          );

        if (existingInvitation)
          throw new BadRequestException(
            "You've already sent an invitation to this user"
          );

        const invitationSaved = await this.invitationRepository.save({
          receiverId: receiver.id,
          senderId: context.userId,
          isExternal: false,
        });

        return invitationSaved;
      }
    } catch (error) {
      throw new BadRequestException(
        "CreateInvitationUseCaseFailed",
        error.message
      );
    }
  }
}
