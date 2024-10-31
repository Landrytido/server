import { ContextualGraphqlRequest, UseCase } from "src";
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import SearchHistory from "src/Api/Entity/SearchHistory";
import SearchHistoryRepository from "src/Api/Repository/SearchHistoryRepository";

@Injectable()
export default class GetAllSearchHistoryByUserIdUseCase
  implements UseCase<Promise<SearchHistory>, [searchHistoryId: number]>
{
  constructor(private readonly searchHistoryRepository: SearchHistoryRepository) {}

  async handle(
  context: ContextualGraphqlRequest, userId: number): Promise<any> {
    try {
      const searchHistory: SearchHistory[] = await this.searchHistoryRepository.findByUserId(userId);
      
      if (!searchHistory) throw new NotFoundException("Search history not found");

      return searchHistory;
    } catch (error) {
      throw new BadRequestException("GetSearchHistoryUseCaseFailed", error.message);
    }
  }
}