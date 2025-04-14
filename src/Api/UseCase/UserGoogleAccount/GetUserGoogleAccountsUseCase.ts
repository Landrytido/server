import { Injectable } from "@nestjs/common";
import { ContextualGraphqlRequest } from "../../../index";
import UserGoogleAccountRepository from "../../Repository/UserGoogleAccount/UserGoogleAccountRepository";
import { UserGoogleAccount } from "@prisma/client";

@Injectable()
export default class GetUserGoogleAccountsUseCase {
  constructor(
    private readonly userGoogleAccountRepository: UserGoogleAccountRepository
  ) {}

  async handle(
    context: ContextualGraphqlRequest
  ): Promise<UserGoogleAccount[]> {
    return this.userGoogleAccountRepository.findByUserId(context.userId);
  }
}
