import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import UseCaseFactory from "../UseCase/UseCaseFactory";
import SaveTagDto from "../Dto/SaveTagDto";
import { ContextualRequest } from "src/Core/Decorator/ContextualRequest";
import { ContextualGraphqlRequest } from "src";
import GetTagUseCase from "../UseCase/Tag/GetTag/GetTagUseCase";
import CreateTagUseCase from "../UseCase/Tag/CreateTag/CreateTagUseCase";
import RemoveTagUseCase from "../UseCase/Tag/RemoveTag/RemoveTagUseCase";
import UpdateTagUseCase from "../UseCase/Tag/UpdateTag/UpdateTagUseCase";
import { UseGuards } from "@nestjs/common";
import GraphqlAuthGuard from "src/Core/Security/Guard/GraphqlAuthGuard";
import Tag from "../Entity/Tag";

@Resolver(Tag)
@UseGuards(GraphqlAuthGuard)
export default class TagResolver {
  constructor(private readonly serviceFactory: UseCaseFactory) {}

  @Mutation(() => Tag)
  async createTag(
    @Args("dto") dto: SaveTagDto,
    @ContextualRequest() context: ContextualGraphqlRequest
  ) {
    return (await this.serviceFactory.create(CreateTagUseCase)).handle(
      context,
      dto
    );
  }

  @Query(() => Tag)
  async findTagById(
    @Args("id") id: number,
    @ContextualRequest() context: ContextualGraphqlRequest
  ) {
    return (await this.serviceFactory.create(GetTagUseCase)).handle(
      context,
      id
    );
  }

  @Mutation(() => Tag)
  async RemoveById(
    @Args("id") id: number,
    @ContextualRequest() context: ContextualGraphqlRequest
  ) {
    return (await this.serviceFactory.create(RemoveTagUseCase)).handle(
      context,
      id
    );
  }

  @Mutation(() => Tag)
  async UpdateById(
    @Args("id", { type: () => Int }) id: number,
    @Args("dto") dto: SaveTagDto,
    @ContextualRequest() context: ContextualGraphqlRequest
  ) {
    return (await this.serviceFactory.create(UpdateTagUseCase)).handle(
      context,
      id,
      dto
    );
  }
}
