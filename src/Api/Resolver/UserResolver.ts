import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { ContextualRequest } from "../../Core/Decorator/ContextualRequest";
import GraphqlAuthGuard from "../../Core/Security/Guard/GraphqlAuthGuard";
import { ContextualGraphqlRequest } from "../../index";
import User from "../Entity/User";
import GetLoggedUserUseCase from "../UseCase/User/GetLoggedUser/GetLoggedUserUseCase";
import UseCaseFactory from "../UseCase/UseCaseFactory";
import SaveUserDto from "../UseCase/User/SaveUser/SaveUserDto";
import SaveUserUseCase from "../UseCase/User/SaveUser/SaveUserUseCase";
import CreateUserUseCase from "../UseCase/User/CreateUser/CreateUserUseCase";
import UncontextualUseCaseFactory from "../UseCase/UncontextualUseCaseFactory";

@Resolver(User)
export default class UserResolver {
  constructor(
    private readonly serviceFactory: UseCaseFactory,
<<<<<<< HEAD
    private readonly uncontextualUseCaseFactory: UncontextualUseCaseFactory,
=======
    private readonly uncontextualUseCaseFactory: UncontextualUseCaseFactory
>>>>>>> main
  ) {}

  @UseGuards(GraphqlAuthGuard)
  @Query(() => User)
  async getLoggedUser(@ContextualRequest() context: ContextualGraphqlRequest) {
    return (await this.serviceFactory.create(GetLoggedUserUseCase)).handle(
<<<<<<< HEAD
      context,
=======
      context
>>>>>>> main
    );
  }

  @Mutation(() => User)
  async register(@Args("dto") dto: SaveUserDto) {
    return (
      await this.uncontextualUseCaseFactory.create(CreateUserUseCase)
    ).handle(dto);
  }

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => User)
  async saveUser(
    @ContextualRequest() context: ContextualGraphqlRequest,
<<<<<<< HEAD
    @Args("dto") dto: SaveUserDto,
  ): Promise<User> {
    return (await this.serviceFactory.create(SaveUserUseCase)).handle(
      context,
      dto,
=======
    @Args("dto") dto: SaveUserDto
  ): Promise<User> {
    return (await this.serviceFactory.create(SaveUserUseCase)).handle(
      context,
      dto
>>>>>>> main
    );
  }
}
