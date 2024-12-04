import { Injectable, BadRequestException } from "@nestjs/common";
import InvitationRepository from "../../../Repository/InvitationRepository";
import { Invitation } from "@prisma/client";
import { ContextualGraphqlRequest, UseCase } from "../../../../index";

@Injectable()
export default class ConvertExternalInvitationUseCase
  implements UseCase<Promise<Invitation>, [invitationToken: string]>
{
  constructor(private readonly invitationRepository: InvitationRepository) {}

  async handle(context: ContextualGraphqlRequest, invitationToken: string) {
    console.log("Token de l'invitation reçu : ", invitationToken);
    const invitation =
      await this.invitationRepository.findInvitationByToken(invitationToken);

    if (!invitation || !invitation.isExternal) {
      throw new BadRequestException("Invitation invalide ou déjà interne.");
    }

    console.log("Invitation trouvée : ", invitation);

    invitation.receiverId = context.userId;
    invitation.isExternal = false;
    invitation.externalEmailInvitation = null;
    invitation.tokenForExternalInvitation = null;

    try {
      const invitationConvertedSaved =
        await this.invitationRepository.save(invitation);
      console.log("invitationConvertedSaved", invitationConvertedSaved);
      return invitationConvertedSaved;
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de l'invitation : ", error);
      throw new BadRequestException(
        "Erreur lors de la conversion de l'invitation."
      );
    }
  }
}
