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

      const userSaved = await this.userRepository.save(dto);

      //ajout =>
      if (dto.invitationToken) {
        await this.convertExternalInvitationUseCase.handle(
          context,
          dto.invitationToken
        );
      }

      return userSaved;
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }
}
