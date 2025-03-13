import { BadRequestException, Injectable } from "@nestjs/common";
import { UncontextualUseCase } from "src";
import InvitationRepository from "src/Api/Repository/InvitationRepository";

@Injectable()
export default class GetExternalEmailByTokenUseCase
  implements UncontextualUseCase<Promise<string>, [token: string]>
{
  constructor(private readonly invitationRepository: InvitationRepository) {}

  async handle(token: string): Promise<string> {
    const invitation =
      await this.invitationRepository.findInvitationByToken(token);

    if (!invitation) {
      throw new BadRequestException("Le token d'invitation est invalide");
    }
    return invitation.externalEmailInvitation;
  }
}
