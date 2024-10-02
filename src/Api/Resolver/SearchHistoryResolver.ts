import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { ContextualRequest } from "../../Core/Decorator/ContextualRequest";
import GraphqlAuthGuard from "../../Core/Security/Guard/GraphqlAuthGuard";
import { ContextualGraphqlRequest } from "../../index";
import SearchHistory from "../Entity/SearchHistory";
import UseCaseFactory from "../UseCase/UseCaseFactory";
import GetSearchHistoryUseCase from "../UseCase/SearchHistory/GetSearchHistory/GetSearchHistoryUseCase";
import SearchHistoryDto from "../Dto/SearchHistoryDto";
import CreateSearchHistoryUseCase from "../UseCase/SearchHistory/CreateSearch/CreateSearchUseCase";
import User from "../Entity/User";
import GetLoggedUserUseCase from "../UseCase/User/GetLoggedUser/GetLoggedUserUseCase";

@Resolver(SearchHistory)

export default class SearchHistoryResolver {
  constructor(private readonly serviceFactory: UseCaseFactory) {}

  @UseGuards(GraphqlAuthGuard)
  @Query(() => [SearchHistory])
  async getSearchHistory(@ContextualRequest() context: ContextualGraphqlRequest, @Args("searchHistoryId") searchHistoryId: number) {
    return (await this.serviceFactory.create(GetSearchHistoryUseCase)).handle(
      context,
      searchHistoryId
    );
  }

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => SearchHistory)
  async saveSearchHistory(

    @ContextualRequest() context: ContextualGraphqlRequest,
    @Args("dto") dto: SearchHistoryDto

  ): Promise<SearchHistory> {
    return (await this.serviceFactory.create(CreateSearchHistoryUseCase)).handle(
      context,
      dto
    );
  }

  @ResolveField(() => User)
  async user(@Parent() user: User, @ContextualRequest() context: ContextualGraphqlRequest): Promise<User> {
      return (await this.serviceFactory.create(GetLoggedUserUseCase)).handle(context)
  }
}
