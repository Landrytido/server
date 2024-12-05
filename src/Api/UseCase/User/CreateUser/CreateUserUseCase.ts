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
import { ContextualGraphqlRequest, UseCase } from "../../../../index";
import UserRepository from "../../../Repository/UserRepository";
import SaveUserUseCase from "../SaveUser/SaveUserUseCase";

@Injectable()
export default class CreateUserUseCase
  implements UseCase<Promise<User>, [dto: SaveUserDto]>
{
  constructor(
    private readonly userRepository: UserRepository,
    private readonly SaveUserUseCase: SaveUserUseCase
  ) {}

  async handle(
    context: ContextualGraphqlRequest,
    dto: SaveUserDto
  ): Promise<User> {
    try {
      console.log("dto createusercase", dto, dto.invitationToken);
      const userCreated = await this.userRepository.create(dto);
      console.log("userCreated usecase", userCreated);

      // Si un invitationToken est fourni, appeler SaveUserUseCase pour le traiter
      if (dto.invitationToken) {
        const userWithInvitation = await this.SaveUserUseCase.handle(
          context,
          dto
        );
        console.log("userWithInvitation usecase", userWithInvitation);
        return userWithInvitation; // Renvoie l'utilisateur avec les modifications traitées par SaveUserUseCase
      }

      return userCreated;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
