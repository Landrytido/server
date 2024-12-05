import { Injectable, BadRequestException } from "@nestjs/common";
import InvitationRepository from "../../../Repository/InvitationRepository";
import { Invitation } from "@prisma/client";
import {
  ContextualGraphqlRequest,
  UncontextualUseCase,
  UseCase,
} from "../../../../index";
import SaveUserDto from "../../User/SaveUser/SaveUserDto";

@Injectable()
export default class ConvertExternalInvitationUseCase
  implements UncontextualUseCase<Promise<Invitation>, [dto: SaveUserDto]>
{
  constructor(private readonly invitationRepository: InvitationRepository) {}

  async handle(dto: SaveUserDto): Promise<Invitation> {
    console.log("Token de l'invitation reçu : ", dto.invitationToken);
    const invitation = await this.invitationRepository.findInvitationByToken(
      dto.invitationToken
    );

    if (!invitation || !invitation.isExternal) {
      throw new BadRequestException("Invitation invalide ou déjà interne.");
    }

    console.log("Invitation trouvée : ", invitation);
    console.log("context.userid dans convert", dto.id);

    invitation.receiverId = dto.id;
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
