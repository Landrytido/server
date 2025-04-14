// src/Api/Resolvers/UserGoogleAccountResolver.ts
import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { ContextualRequest } from "../../../Core/Decorator/ContextualRequest";
import { ContextualGraphqlRequest as CtxRequest } from "../../../index";
import GraphqlAuthGuard from "../../../Core/Security/Guard/GraphqlAuthGuard";
import UseCaseFactory from "../../UseCase/UseCaseFactory";

import UserGoogleAccount from "../../Entity/UserGoogleAccount/UserGoogleAccount";
import { CreateUserGoogleAccountDto } from "../../Dto/UserGoogleAccountDto/CreateUserGoogleAccountDto";

import GetUserGoogleAccountsUseCase from "../../UseCase/UserGoogleAccount/GetUserGoogleAccountsUseCase";
import CreateUserGoogleAccountUseCase from "../../UseCase/UserGoogleAccount/CreateUserGoogleAccountUseCase";
import DeleteUserGoogleAccountUseCase from "../../UseCase/UserGoogleAccount/DeleteUserGoogleAccountUseCase";
import SetDefaultUserGoogleAccountUseCase from "../../UseCase/UserGoogleAccount/SetDefaultUserGoogleAccountUseCase";

@Resolver(() => UserGoogleAccount)
export default class GoogleAccountResolver {
  constructor(private readonly useCaseFactory: UseCaseFactory) {}

  @UseGuards(GraphqlAuthGuard)
  @Query(() => [UserGoogleAccount])
  async getUserGoogleAccounts(
    @ContextualRequest() context: CtxRequest
  ): Promise<UserGoogleAccount[]> {
    return (await (
      await this.useCaseFactory.create(GetUserGoogleAccountsUseCase)
    ).handle(context)) as UserGoogleAccount[];
  }

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => UserGoogleAccount)
  async createUserGoogleAccount(
    @ContextualRequest() context: CtxRequest,
    @Args("dto") dto: CreateUserGoogleAccountDto
  ): Promise<UserGoogleAccount> {
    return (await (
      await this.useCaseFactory.create(CreateUserGoogleAccountUseCase)
    ).handle(context, dto)) as UserGoogleAccount;
  }

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => UserGoogleAccount)
  async deleteUserGoogleAccount(
    @ContextualRequest() context: CtxRequest,
    @Args("email") email: string
  ): Promise<UserGoogleAccount> {
    return (await (
      await this.useCaseFactory.create(DeleteUserGoogleAccountUseCase)
    ).handle(context, email)) as UserGoogleAccount;
  }

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => UserGoogleAccount)
  async setDefaultUserGoogleAccount(
    @ContextualRequest() context: CtxRequest,
    @Args("email") email: string
  ): Promise<UserGoogleAccount> {
    return (await (
      await this.useCaseFactory.create(SetDefaultUserGoogleAccountUseCase)
    ).handle(context, email)) as UserGoogleAccount;
  }
}
