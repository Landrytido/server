// @ts-ignore
import {Args, Context, Int, Mutation, Query, Resolver} from "@nestjs/graphql";
import {LinkGroup} from "../Entity/LinkGroup";
import {UseGuards} from "@nestjs/common";
import GraphqlAuthGuard from "../../Core/Security/Guard/GraphqlAuthGuard";
import UseCaseFactory from "../UseCase/UseCaseFactory";
import {ContextualRequest} from "../../Core/Decorator/ContextualRequest";
import {CreateLinkGroupDto} from "../UseCase/LinkGroup/CreateLinkGroup/CreateLinkGroupDto";
import {CreateLinkGroupUseCase} from "../UseCase/LinkGroup/CreateLinkGroup/CreateLinkGroupUseCase";
import {ContextualGraphqlRequest} from "../../index";
import {
    GetAllLinkGroupsUseCase
} from "../UseCase/LinkGroup/GetAllLinkGroups/GetAllLinkGroupsUseCase";
import {UpdateLinkGroupDto} from "../UseCase/LinkGroup/UpdateLinkGroup/UpdateLinkGroupDto";
import {UpdateLinkGroupUseCase} from "../UseCase/LinkGroup/UpdateLinkGroup/UpdateLinkGroupUseCase";
import {GetLinkGroupByIdUseCase} from "../UseCase/LinkGroup/GetLinkGroupById/GetLinkGroupByIdUseCase";
import {DeleteLinkGroupUseCase} from "../UseCase/LinkGroup/DeleteLinkGroup/DeleteLinkGroupUseCase";
import {GetLinkGroupsByUserIdUseCase} from "../UseCase/LinkGroup/GetLinkGroupByUserId/GetLinkGroupByUserIdUseCase";


@Resolver(LinkGroup)
@UseGuards(GraphqlAuthGuard)
export class LinkGroupResolver {
    constructor(private readonly serviceFactory: UseCaseFactory) {}


    @Mutation(() => LinkGroup)
    async createLinkGroup(
        @ContextualRequest() context: ContextualGraphqlRequest,
        @Args('dto') dto: CreateLinkGroupDto
    ): Promise<LinkGroup> {
        return (await this.serviceFactory.create(CreateLinkGroupUseCase)).handle(context, dto)
    }

    @Query(() => [LinkGroup])
    async getAllLinkGroups(
        @ContextualRequest() context: ContextualGraphqlRequest,
    ): Promise<LinkGroup[]>{
        const useCase = await this.serviceFactory.create(GetAllLinkGroupsUseCase);
        return useCase.handle(context);
    }

    @Mutation(() => LinkGroup)
    async updateLinkGroup(
        @ContextualRequest() context: ContextualGraphqlRequest,
        @Args('linkGroupId',{ type:() => Int }) linkGroupId: number,
        @Args('dto') dto: UpdateLinkGroupDto,
    ): Promise<LinkGroup> {
        return (await this.serviceFactory.create(UpdateLinkGroupUseCase)).handle(context, linkGroupId, dto)
    }

    @Query(() => LinkGroup)
    async findLinkGroupById(
        @ContextualRequest() context: ContextualGraphqlRequest,
        @Args('linkGroupId', { type: () => Int }) linkGroupId: number,
    ): Promise<LinkGroup> {
        return (await this.serviceFactory.create(GetLinkGroupByIdUseCase)).handle(context, linkGroupId);
    }

    @Query(() => [LinkGroup])
    async findLinkGroupsByUserId(
        @ContextualRequest() context: ContextualGraphqlRequest,
        @Args('userId', { type: () => Int }) userId: number,
    ): Promise<LinkGroup[]> {
        return (await this.serviceFactory.create(GetLinkGroupsByUserIdUseCase)).handle(context, userId);
    }

    @Mutation(() => LinkGroup)
    async deleteLinkGroup(
        @ContextualRequest() context: ContextualGraphqlRequest,
        @Args('linkGroupId', { type: () => Int }) linkGroupId: number,
    ): Promise<LinkGroup> {
        return (await this.serviceFactory.create(DeleteLinkGroupUseCase)).handle(context, linkGroupId);
    }
}


