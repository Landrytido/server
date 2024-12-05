import { ForbiddenException, Injectable } from "@nestjs/common";
import { ContextualGraphqlRequest, UseCase } from "../../../../index";
import User from "src/Api/Entity/User";
import UserRepository from "../../../Repository/UserRepository";
import SaveUserDto from "./SaveUserDto";
import ConvertExternalInvitationUseCase from "../../Invitation/ConvertExternalInvitation/ConvertExternalInvitationUseCase";

@Injectable()
export default class SaveUserUseCase
  implements UseCase<Promise<User>, [dto: SaveUserDto]>
{
  constructor(
    private readonly userRepository: UserRepository,
    private readonly convertExternalInvitationUseCase: ConvertExternalInvitationUseCase
  ) {}

  async handle(
    context: ContextualGraphqlRequest,
    dto: SaveUserDto
  ): Promise<User> {
    try {
      if (dto.id && context.userId !== dto.id) {
        throw new ForbiddenException("Not authorized");
      }

      //ajout =>
      if (dto.invitationToken) {
        console.log("dto.invitation:", dto.invitationToken);
        await this.convertExternalInvitationUseCase.handle(
          context,
          dto.invitationToken
        );
        console.log(
          "await saveuserusecase",
          await this.convertExternalInvitationUseCase.handle(
            context,
            dto.invitationToken
          )
        );
        console.log(
          "Après l'appel à convertExternalInvitationUseCase, invitationToken traité"
        );
      }

      const userSaved = await this.userRepository.save(dto);
      console.log("userSaved userusecase:", userSaved);

      return userSaved;
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }
}
