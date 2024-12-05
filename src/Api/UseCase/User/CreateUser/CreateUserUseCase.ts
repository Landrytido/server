import { BadRequestException, Injectable } from "@nestjs/common";
import SaveUserDto from "../SaveUser/SaveUserDto";
import User from "../../../Entity/User";
import { UncontextualUseCase } from "../../../../index";
import UserRepository from "../../../Repository/UserRepository";
import ConvertExternalInvitationUseCase from "../../Invitation/ConvertExternalInvitation/ConvertExternalInvitationUseCase";

@Injectable()
export default class CreateUserUseCase
  implements UncontextualUseCase<Promise<User>, [dto: SaveUserDto]>
{
  constructor(
    private readonly userRepository: UserRepository,
    private readonly convertExternalInvitationUseCase: ConvertExternalInvitationUseCase
  ) {}

  async handle(dto: SaveUserDto): Promise<User> {
    try {
      const userCreated = await this.userRepository.create(dto);

      if (dto.invitationToken) {
        dto.id = userCreated.id;
        await this.convertExternalInvitationUseCase.handle(dto);
      }
      return userCreated;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
