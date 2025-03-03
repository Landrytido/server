// src/Resolver/Link/LinkGroupResolver.ts
import {Resolver, Mutation, Args, Query} from '@nestjs/graphql';
import {UseGuards} from '@nestjs/common';
import GraphqlAuthGuard from '../../../Core/Security/Guard/GraphqlAuthGuard';
import UseCaseFactory from '../../UseCase/UseCaseFactory';
import LinkGroup from '../../Entity/Link/LinkGroup';
import {SaveLinkGroupDto} from '../../Dto/LinkDto/SaveLinkGroupDto';
import {ContextualRequest} from "../../../Core/Decorator/ContextualRequest";
import {ContextualGraphqlRequest} from "../../../index";
import SaveLinkGroupUseCase from "../../UseCase/Links/LinkGroup/SaveLinkGroupUseCase/SaveLinkGroupUseCase";
import DeleteLinkGroupUseCase from "../../UseCase/Links/LinkGroup/DeleteLinkGroupUseCase/DeleteLinkGroupUseCase";
import GetMyLinkGroupsUseCase from "../../UseCase/Links/LinkGroup/GetMyLinkGroupsUseCase/GetMyLinkGroupsUseCase";

@Resolver(LinkGroup)
export default class LinkGroupResolver {
    constructor(private readonly useCaseFactory: UseCaseFactory) {
    }

    @UseGuards(GraphqlAuthGuard)
    @Mutation(() => LinkGroup)
    async saveLinkGroup(
	    @ContextualRequest() context: ContextualGraphqlRequest,
	    @Args('dto') dto: SaveLinkGroupDto,
    ): Promise<LinkGroup> {
	  // @ts-ignore
	  return (await this.useCaseFactory.create(SaveLinkGroupUseCase)).handle(context, dto);
    }

    @UseGuards(GraphqlAuthGuard)
    @Mutation(() => LinkGroup)
    async deleteLinkGroup(
	    @ContextualRequest() context: ContextualGraphqlRequest,
	    @Args('id') id: string,
    ): Promise<LinkGroup> {
	  // @ts-ignore
	  return (await this.useCaseFactory.create(DeleteLinkGroupUseCase)).handle(context, id);
    }

    // Optionally, add queries to fetch groups (by user or id) if needed.
    @UseGuards(GraphqlAuthGuard)
    @Query(() => [LinkGroup])
    async myLinkGroups(
	    @ContextualRequest() context: ContextualGraphqlRequest,
    ): Promise<LinkGroup[]> {
	  // @ts-ignore
	  return (await this.useCaseFactory.create(GetMyLinkGroupsUseCase)).handle(context);
    }
}
