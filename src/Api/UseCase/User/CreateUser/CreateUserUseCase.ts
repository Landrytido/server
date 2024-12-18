import { BadRequestException, Injectable } from "@nestjs/common";
import SaveUserDto from "../SaveUser/SaveUserDto";
import User from "../../../Entity/User";
import { UncontextualUseCase } from "../../../../index";
import UserRepository from "../../../Repository/UserRepository";
import ConvertExternalInvitationUseCase from "../../Invitation/ConvertExternalInvitation/ConvertExternalInvitationUseCase";
import InvitationRepository from "src/Api/Repository/InvitationRepository";

@Injectable()
export default class CreateUserUseCase
  implements UncontextualUseCase<Promise<User>, [dto: SaveUserDto]>
{
  constructor(
    private readonly userRepository: UserRepository,
    private readonly invitationRepository: InvitationRepository, //ajout
    private readonly convertExternalInvitationUseCase: ConvertExternalInvitationUseCase
  ) {}

  async handle(dto: SaveUserDto): Promise<User> {
    try {
      //ajout
      const existingUser = await this.userRepository.findByEmail(dto.email);
      if (existingUser) {
        throw new BadRequestException(
          "This email is already used by another account"
        );
      }
      //fin ajout
      const userCreated = await this.userRepository.create(dto);

      if (dto.invitationToken) {
        dto.id = userCreated.id;
        await this.convertExternalInvitationUseCase.handle(dto);
      } else {
        // MODIF A PARTIR DU ELSE Sinon, associez toutes les invitations externes en attente à cet email
        const pendingInvitations =
          await this.invitationRepository.findPendingInvitationsByEmail(
            dto.email
          );

        for (const invitation of pendingInvitations) {
          // Convertissez chaque invitation externe
          await this.convertExternalInvitationUseCase.handle({
            ...dto,
            id: userCreated.id,
            invitationToken: invitation.tokenForExternalInvitation,
          });
        }
      } //fin ajout
      return userCreated;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
