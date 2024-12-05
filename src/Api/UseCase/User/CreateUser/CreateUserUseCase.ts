// import { BadRequestException, Injectable } from "@nestjs/common";
// import SaveUserDto from "../SaveUser/SaveUserDto";
// import User from "../../../Entity/User";
// import { UncontextualUseCase } from "../../../../index";
// import UserRepository from "../../../Repository/UserRepository";

// @Injectable()
// export default class CreateUserUseCase
//   implements UncontextualUseCase<Promise<User>, [dto: SaveUserDto]>
// {
//   constructor(private readonly userRepository: UserRepository) {}

//   async handle(dto: SaveUserDto): Promise<User> {
//     try {
//       console.log("dto createusercase", dto, dto.invitationToken);
//       const userCreated = await this.userRepository.create(dto);
//       console.log("userCreated usecase", userCreated);

//       // Si un invitationToken est fourni, appeler SaveUserUseCase pour le traiter
//       // if (dto.invitationToken) {
//       //   const context = {userId: null}; // Vous devez passer le contexte approprié ici (e.g., userId, role)
//       //   const userWithInvitation = await this.saveUserUseCase.handle(
//       //     context,
//       //     dto
//       //   );
//       //   console.log("userWithInvitation usecase", userWithInvitation);
//       //   return userWithInvitation; // Renvoie l'utilisateur avec les modifications traitées par SaveUserUseCase
//       // }

//       return userCreated;
//     } catch (error) {
//       throw new BadRequestException(error.message);
//     }
//   }
// }

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
      console.log("dto createusercase", dto, dto.invitationToken);
      const userCreated = await this.userRepository.create(dto);
      console.log("userCreated usecase", userCreated);

      //ajout =>
      if (dto.invitationToken) {
        console.log("dto.invitation:", dto.invitationToken);
        dto.id = userCreated.id;
        console.log("dto.id:", dto.id);
        await this.convertExternalInvitationUseCase.handle(dto);

        console.log(
          "Après l'appel à convertExternalInvitationUseCase, invitationToken traité"
        );
      }

      return userCreated;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
