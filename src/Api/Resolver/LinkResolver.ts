import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import Link from "../Entity/Link";
import GraphqlAuthGuard from "../../Core/Security/Guard/GraphqlAuthGuard";
import UseCaseFactory from "../UseCase/UseCaseFactory";
import { ContextualRequest } from "../../Core/Decorator/ContextualRequest";
import { ContextualGraphqlRequest } from "../../index";
import { SaveLinkDto } from "../UseCase/Link/CreateLink/SaveLinkDto";
import CreateLinkUseCase from "../UseCase/Link/CreateLink/CreateLinkUseCase";
import GetLinkByIdUseCase from "../UseCase/Link/GetLinkById/GetLinkByIdUseCase";
import GetLinksByUserIdUseCase from "../UseCase/Link/GetLinksByUserId/GetLinksByUserIdUseCase";
import UpdateLinkUseCase from "../UseCase/Link/UpdateLink/UpdateLinkUseCase";
import UpdateLinkDto from "../UseCase/Link/UpdateLink/UpdateLinkDto";
import DeleteLinkUseCase from "../UseCase/Link/DeleteLink/DeleteLinkUseCase";
import GetLinksByLinkGroupIdUseCase from "../UseCase/Link/GetLinksByLinkGroupId/GetLinksByLinkGroupIdUseCase";
import { PrismaService } from "../../Core/Datasource/Prisma";
import LinkGroup from "../Entity/LinkGroup";
import User from "../Entity/User";

@Resolver(Link)
export default class LinkResolver {
  constructor(
    private readonly serviceFactory: UseCaseFactory,
    private readonly prisma: PrismaService,
  ) {}

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => Link)
  async create(
    @ContextualRequest() context: ContextualGraphqlRequest,
    @Args("dto") dto: SaveLinkDto,
  ) {
    return (await this.serviceFactory.create(CreateLinkUseCase)).handle(
      context,
      dto,
    );
  }

  @UseGuards(GraphqlAuthGuard)
  @Query(() => Link)
  async findLinkById(
    @ContextualRequest() context: ContextualGraphqlRequest,
    @Args("id", { type: () => Int }) id: number,
  ) {
    return (await this.serviceFactory.create(GetLinkByIdUseCase)).handle(
      context,
      id,
    );
  }

  @UseGuards(GraphqlAuthGuard)
  @Query(() => [Link])
  async findLinksByUserId(
    @ContextualRequest() context: ContextualGraphqlRequest,
  ) {
    return (await this.serviceFactory.create(GetLinksByUserIdUseCase)).handle(
      context,
    );
  }

  @UseGuards(GraphqlAuthGuard)
  @Query(() => [Link])
  async findLinksByLinkGroupId(
    @ContextualRequest() context: ContextualGraphqlRequest,
    @Args("linkGroupId", { type: () => Int }) linkGroupId: number,
  ) {
    return (
      await this.serviceFactory.create(GetLinksByLinkGroupIdUseCase)
    ).handle(context, linkGroupId);
  }

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => Link)
  async updateLink(
    @ContextualRequest() context: ContextualGraphqlRequest,
    @Args("id", { type: () => Int }) id: number,
    @Args("dto") dto: UpdateLinkDto,
  ) {
    return (await this.serviceFactory.create(UpdateLinkUseCase)).handle(
      context,
      id,
      dto,
    );
  }

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => Link)
  async deleteLink(
    @ContextualRequest() context: ContextualGraphqlRequest,
    @Args("id", { type: () => Int }) id: number,
  ) {
    return (await this.serviceFactory.create(DeleteLinkUseCase)).handle(
      context,
      id,
    );
  }

  @ResolveField(() => LinkGroup)
  async linkGroup(@Parent() link: Link) {
    return this.prisma.linkGroup.findUnique({
      where: { id: link.linkGroupId },
    });
  }

  @ResolveField(() => User)
  async user(@Parent() link: Link) {
    return this.prisma.user.findUnique({ where: { id: link.userId } });
  }
}
