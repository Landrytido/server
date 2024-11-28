import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import LinkGroup from "../Entity/LinkGroup";
import { UseGuards } from "@nestjs/common";
import GraphqlAuthGuard from "../../Core/Security/Guard/GraphqlAuthGuard";
import UseCaseFactory from "../UseCase/UseCaseFactory";
import { ContextualRequest } from "../../Core/Decorator/ContextualRequest";
import CreateLinkGroupUseCase from "../UseCase/LinkGroup/CreateLinkGroup/CreateLinkGroupUseCase";
import { ContextualGraphqlRequest } from "../../index";
import GetAllLinkGroupsUseCase from "../UseCase/LinkGroup/GetAllLinkGroups/GetAllLinkGroupsUseCase";
import UpdateLinkGroupUseCase from "../UseCase/LinkGroup/UpdateLinkGroup/UpdateLinkGroupUseCase";
import GetLinkGroupByIdUseCase from "../UseCase/LinkGroup/GetLinkGroupById/GetLinkGroupByIdUseCase";
import DeleteLinkGroupUseCase from "../UseCase/LinkGroup/DeleteLinkGroup/DeleteLinkGroupUseCase";
import GetLinkGroupsByUserIdUseCase from "../UseCase/LinkGroup/GetLinkGroupByUserId/GetLinkGroupByUserIdUseCase";
import CreateLinkGroupDto from "../UseCase/LinkGroup/CreateLinkGroup/CreateLinkGroupDto";
import User from "../Entity/User";
import Link from "../Entity/Link";
import { PrismaService } from "../../Core/Datasource/Prisma";
import GetSortedLinkGroupsWithTotalClicksUseCase
  from "../UseCase/LinkGroup/GetSortedLinkGroupsWithTotalClicks/GetSortedLinkGroupsWithTotalClicksUseCase";

@Resolver(LinkGroup)
export default class LinkGroupResolver {
  constructor(
    private readonly serviceFactory: UseCaseFactory,
    private readonly prisma: PrismaService,
  ) {}

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => LinkGroup)

  async createLinkGroup(
    @ContextualRequest() context: ContextualGraphqlRequest,
    @Args("dto") dto: CreateLinkGroupDto,
  ) {
    return (await this.serviceFactory.create(CreateLinkGroupUseCase)).handle(
      context,
      dto,
    );
  }

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => LinkGroup)
  async updateLinkGroup(
    @ContextualRequest() context: ContextualGraphqlRequest,
    @Args("linkGroupId", { type: () => Int }) linkGroupId: number,
    @Args("dto") dto: CreateLinkGroupDto,
  ) {
    return (await this.serviceFactory.create(UpdateLinkGroupUseCase)).handle(
      context,
      linkGroupId,
      dto,
    );
  }

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => LinkGroup)
  async deleteLinkGroup(
    @ContextualRequest() context: ContextualGraphqlRequest,
    @Args("linkGroupId", { type: () => Int }) linkGroupId: number,
  ) {
    return (await this.serviceFactory.create(DeleteLinkGroupUseCase)).handle(
      context,
      linkGroupId,
    );
  }

  @UseGuards(GraphqlAuthGuard)
  @Query(() => [LinkGroup])
  async getAllLinkGroups(
    @ContextualRequest() context: ContextualGraphqlRequest,
  ) {
    return (await this.serviceFactory.create(GetAllLinkGroupsUseCase)).handle(
      context,
    );
  }

  @UseGuards(GraphqlAuthGuard)
  @Query(() => LinkGroup)
  async findLinkGroupById(
    @ContextualRequest() context: ContextualGraphqlRequest,
    @Args("linkGroupId", { type: () => Int }) linkGroupId: number,
  ) {
    return (await this.serviceFactory.create(GetLinkGroupByIdUseCase)).handle(
      context,
      linkGroupId,
    );
  }

  @UseGuards(GraphqlAuthGuard)
  @Query(() => [LinkGroup])
  async findLinkGroupsSortByUserId(
      @ContextualRequest() context: ContextualGraphqlRequest,
  ) {
    return (
        await this.serviceFactory.create(GetSortedLinkGroupsWithTotalClicksUseCase)
    ).handle(context);
  }

  @UseGuards(GraphqlAuthGuard)
  @Query(() => [LinkGroup])
  async findLinkGroupsByUserId(
    @ContextualRequest() context: ContextualGraphqlRequest,
  ) {
    return (
      await this.serviceFactory.create(GetLinkGroupsByUserIdUseCase)
    ).handle(context);
  }

  @ResolveField(() => User)
  async user(@Parent() linkGroup: LinkGroup) {
    return this.prisma.user.findUnique({ where: { id: linkGroup.userId } });
  }

  @ResolveField(() => [Link])
  async links(@Parent() linkGroup: LinkGroup) {
    return this.prisma.link.findMany({ where: { linkGroupId: linkGroup.id } });
  }
}
