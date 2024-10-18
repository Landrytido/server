import { UseGuards } from "@nestjs/common";
import { Args, Int, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { ContextualRequest } from "../../Core/Decorator/ContextualRequest";
import GraphqlAuthGuard from "../../Core/Security/Guard/GraphqlAuthGuard";
import { ContextualGraphqlRequest } from "../../index";
import SearchHistory from "../Entity/SearchHistory";
import UseCaseFactory from "../UseCase/UseCaseFactory";
import GetSearchHistoryUseCase from "../UseCase/SearchHistory/GetSearchHistory/GetAllSearchHistoryByUserIdUseCase";
import SearchHistoryDto from "../Dto/SearchHistoryDto";
import CreateSearchHistoryUseCase from "../UseCase/SearchHistory/CreateSearch/CreateSearchUseCase";
import User from "../Entity/User";
import GetLoggedUserUseCase from "../UseCase/User/GetLoggedUser/GetLoggedUserUseCase";
import DeleteSearchHistoryUseCase from "../UseCase/SearchHistory/DeleteSearch/DeleteSearchUseCase";

@Resolver(SearchHistory)

export default class SearchHistoryResolver {
  constructor(private readonly serviceFactory: UseCaseFactory) {}

  @UseGuards(GraphqlAuthGuard)
  @Query(() => [SearchHistory])
  async getSearchHistoryByUserId(@ContextualRequest() context: ContextualGraphqlRequest) {
     const userIdLogged = (await (await this.serviceFactory.create(GetLoggedUserUseCase)).handle(context)).id;

    return (await this.serviceFactory.create(GetSearchHistoryUseCase)).handle(
      context,
      userIdLogged
    );
  }

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => SearchHistory)
  async saveSearchHistory(
    @ContextualRequest() context: ContextualGraphqlRequest,
    @Args("dto") dto: SearchHistoryDto
  ): Promise<SearchHistory> {

    if(dto.searchTerm){

        
    const userIdLogged = (await (await this.serviceFactory.create(GetLoggedUserUseCase)).handle(context)).id;
    
    const allSearchHistoryOfUser: SearchHistory[] = await this.getSearchHistoryByUserId(context);
  
    
    if (allSearchHistoryOfUser.length >= 20) {
      const oldestSearchHistory = allSearchHistoryOfUser[allSearchHistoryOfUser.length - 1]; 
      await (await this.serviceFactory.create(DeleteSearchHistoryUseCase)).handle(context, oldestSearchHistory.id);
    }
  
    const newSearch = await (await this.serviceFactory.create(CreateSearchHistoryUseCase)).handle(
      context,
      dto
    );
    
    allSearchHistoryOfUser.unshift(newSearch);
    
    return newSearch;

    }
  }

  @UseGuards(GraphqlAuthGuard)
@Mutation(() => Boolean)
async deleteSearchHistory(
  @ContextualRequest() context: ContextualGraphqlRequest,
  @Args("searchHistoryId", { type: () => Int }) searchHistoryId: number
): Promise<boolean> {
  try {
    await (await this.serviceFactory.create(DeleteSearchHistoryUseCase)).handle(context, searchHistoryId);
    return true;
  } catch (error) {
    console.error("Erreur lors de la suppression de l'historique de recherche :", error);
    return false;
  }
}

  @ResolveField(() => User)
  async user(@Parent() user: User, @ContextualRequest() context: ContextualGraphqlRequest): Promise<User> {
      return (await this.serviceFactory.create(GetLoggedUserUseCase)).handle(context)
  }
}
