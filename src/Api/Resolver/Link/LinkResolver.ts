// src/Resolver/Link/LinkResolver.ts
import {Resolver, Mutation, Args, Query, Int} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import GraphqlAuthGuard from '../../../Core/Security/Guard/GraphqlAuthGuard';
import UseCaseFactory from '../../UseCase/UseCaseFactory';
import { SaveLinkDto } from '../../Dto/LinkDto/SaveLinkDto';
import Link from '../../Entity/Link/Link';
import {LinkGroupLink as LinkGroupLinkRelation} from '../../Entity/Link/LinkGroupLink';
import {ContextualRequest} from "../../../Core/Decorator/ContextualRequest";
import {ContextualGraphqlRequest} from "../../../index";
import CreateLinkFromLinkGroupUseCase
    from "../../UseCase/Links/Link/CreateLinkFromLinkGroupUseCase/CreateLinkFromLinkGroupUseCase";
import UpdateLinkRelationUseCase
    from "../../UseCase/Links/LinkGroupLink/UpdateLinkRelationUseCase/UpdateLinkRelationUseCase";
import DeleteLinkFromGroupUseCase from "../../UseCase/Links/Link/DeleteLinkFromGroupUseCase/DeleteLinkFromGroupUseCase";
import IncrementClickCounterUseCase
    from "../../UseCase/Links/LinkGroupLink/IncrementClickCounterUseCase/IncrementClickCounterUseCase";
import ResetClickCounterUseCase
    from "../../UseCase/Links/LinkGroupLink/ResetClickCounterUseCase/ResetClickCounterUseCase";
import {LinkGroupLink} from "@prisma/client";
import FindHotLinksUseCase from "../../UseCase/Links/LinkGroupLink/FindHotLinksUseCase/FindHotLinksUseCase";

@Resolver(Link)
export default class LinkResolver {
    constructor(private readonly useCaseFactory: UseCaseFactory) {}

    @UseGuards(GraphqlAuthGuard)
    @Mutation(() => Link)
    async createLink(
	    @ContextualRequest() context: ContextualGraphqlRequest,
	    @Args('dto') dto: SaveLinkDto,
    ): Promise<Link> {
	  return (await this.useCaseFactory.create(CreateLinkFromLinkGroupUseCase)).handle(context, dto);
    }

    @UseGuards(GraphqlAuthGuard)
    @Mutation(() => LinkGroupLinkRelation)
    async updateLinkRelation(
	    @ContextualRequest() context: ContextualGraphqlRequest,
	    @Args('dto') dto: SaveLinkDto,
    ): Promise<LinkGroupLink> {
	  return (await this.useCaseFactory.create(UpdateLinkRelationUseCase)).handle(context, dto);
    }

    @UseGuards(GraphqlAuthGuard)
    @Mutation(() => Boolean)
    async deleteLinkFromGroup(
	    @ContextualRequest() context: ContextualGraphqlRequest,
	    @Args('linkGroupId') linkGroupId: string,
	    @Args('linkId') linkId: string,
    ): Promise<boolean> {
	  await (await this.useCaseFactory.create(DeleteLinkFromGroupUseCase)).handle(context, linkGroupId, linkId);
	  return true;
    }

    @UseGuards(GraphqlAuthGuard)
    @Mutation(() => LinkGroupLinkRelation)
    async incrementClickCounter(
	    @ContextualRequest() context: ContextualGraphqlRequest,
	    @Args('linkGroupId') linkGroupId: string,
	    @Args('linkId') linkId: string,
    ): Promise<LinkGroupLink> {
	  return (await this.useCaseFactory.create(IncrementClickCounterUseCase)).handle(context, linkGroupId, linkId);
    }

    @UseGuards(GraphqlAuthGuard)
    @Mutation(() => LinkGroupLinkRelation)
    async resetClickCounter(
	    @ContextualRequest() context: ContextualGraphqlRequest,
	    @Args('linkGroupId') linkGroupId: string,
	    @Args('linkId') linkId: string,
    ): Promise<LinkGroupLink> {
	  return (await this.useCaseFactory.create(ResetClickCounterUseCase)).handle(context, linkGroupId, linkId);
    }

    @UseGuards(GraphqlAuthGuard)
    @Query(() => [LinkGroupLinkRelation])
    async findHotLinks(
        @ContextualRequest() context: ContextualGraphqlRequest,
        @Args('limit', { type: () => Int }) limit: number,
    ): Promise<LinkGroupLink[]> {
        return (await this.useCaseFactory.create(FindHotLinksUseCase)).handle(context, limit);
    }
}
