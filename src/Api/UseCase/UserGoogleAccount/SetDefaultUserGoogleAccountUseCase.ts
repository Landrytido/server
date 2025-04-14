import { Injectable, NotFoundException } from "@nestjs/common";
import { ContextualGraphqlRequest } from "../../../index";
import UserGoogleAccountRepository from "../../Repository/UserGoogleAccount/UserGoogleAccountRepository";
import { UserGoogleAccount } from "@prisma/client";

@Injectable()
export default class SetDefaultUserGoogleAccountUseCase {
  constructor(
    private readonly userGoogleAccountRepository: UserGoogleAccountRepository
  ) {}

  async handle(
    context: ContextualGraphqlRequest,
    email: string
  ): Promise<UserGoogleAccount> {
    const account = await this.userGoogleAccountRepository.findByUserIdAndEmail(
      context.userId,
      email
    );

    if (!account) {
      throw new NotFoundException("Compte Google non trouvé");
    }

    return this.userGoogleAccountRepository.setDefault(context.userId, email);
  }
}
