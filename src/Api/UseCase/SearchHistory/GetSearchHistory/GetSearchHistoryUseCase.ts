import { ContextualGraphqlRequest, UseCase } from "src";
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import SearchHistory from "src/Api/Entity/SearchHistory";
import SearchHistoryRepository from "src/Api/Repository/SearchHistoryRepository";

@Injectable()
export default class GetSearchHistoryUseCase
  implements UseCase<Promise<SearchHistory>, [searchHistoryId: number]>
{
  constructor(private readonly searchHistoryRepository: SearchHistoryRepository) {}

  async handle(
  context: ContextualGraphqlRequest, searchHistoryId: number): Promise<SearchHistory> {
    try {
      const searchHistory = await this.searchHistoryRepository.findById(searchHistoryId);
      
      if (!searchHistory) throw new NotFoundException("Search history not found");

      return searchHistory;
    } catch (error) {
      throw new BadRequestException("GetSearchHistoryUseCaseFailed", error.message);
    }
  }
}