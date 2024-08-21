import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  Parent,
  ResolveField,
} from "@nestjs/graphql";
import LinkClick from "../Entity/LinkClick";
import UseCaseFactory from "../UseCase/UseCaseFactory";
import { ContextualRequest } from "../../Core/Decorator/ContextualRequest";
import { ContextualGraphqlRequest } from "../../index";
import { UseGuards } from "@nestjs/common";
import GraphqlAuthGuard from "../../Core/Security/Guard/GraphqlAuthGuard";
import SaveLinkClickUseCase from "../UseCase/LinkClick/SaveLinkClick/SaveLinkClickUseCase";
import SaveLinkClickDto from "../UseCase/LinkClick/SaveLinkClick/SaveLinkClickDto";
import GetLinkClickByIdUseCase from "../UseCase/LinkClick/GetLinkClick/GetLinkClickByIdUseCase";
import DeleteLinkClickUseCase from "../UseCase/LinkClick/DeleteLinkClick/DeleteLinkClickUseCase";
import GetLinkClickByLinkUseCase from "../UseCase/LinkClick/GetLinkClickByLink/GetLinkClickByLink";
import GetLinkClickByUserUseCase from "../UseCase/LinkClick/GetLinkClickByUser/GetLinkClickByUserUseCase";
import Link from "../Entity/Link";
import LinkRepository from "../Repository/LinkRepository";

@Resolver(() => LinkClick)
export default class LinkClickResolver {
  constructor(
    private readonly serviceFactory: UseCaseFactory,
    private readonly linkRepository: LinkRepository,
  ) {}

  @UseGuards(GraphqlAuthGuard)
  @Query(() => LinkClick)
  async findOne(
    @ContextualRequest() context: ContextualGraphqlRequest,
    @Args("id", { type: () => Int }) id: number,
  ) {
    return (await this.serviceFactory.create(GetLinkClickByIdUseCase)).handle(
      context,
      id,
    );
  }

  @UseGuards(GraphqlAuthGuard)
  @Query(() => [LinkClick])
  async findByUser(@ContextualRequest() context: ContextualGraphqlRequest) {
    return (await this.serviceFactory.create(GetLinkClickByUserUseCase)).handle(
      context,
    );
  }

  @UseGuards(GraphqlAuthGuard)
  @Query(() => [LinkClick])
  async findByLinkId(
    @ContextualRequest() context: ContextualGraphqlRequest,
    @Args("linkId", { type: () => Int }) linkId: number,
  ) {
    return (await this.serviceFactory.create(GetLinkClickByLinkUseCase)).handle(
      context,
      linkId,
    );
  }

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => LinkClick)
  async saveClicks(
    @ContextualRequest() context: ContextualGraphqlRequest,
    @Args("dto") dto: SaveLinkClickDto,
  ) {
    return (await this.serviceFactory.create(SaveLinkClickUseCase)).handle(
      context,
      dto,
    );
  }

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => LinkClick)
  async delete(
    @ContextualRequest() context: ContextualGraphqlRequest,
    @Args("id", { type: () => Int }) id: number,
  ) {
    return (await this.serviceFactory.create(DeleteLinkClickUseCase)).handle(
      context,
      id,
    );
  }

  @ResolveField(() => Link)
  async link(@Parent() linkClick: LinkClick) {
    return this.linkRepository.findById(linkClick.linkId);
  }
}
