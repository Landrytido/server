import { ContextualGraphqlRequest, UseCase } from "src";
import { BadRequestException, Injectable } from "@nestjs/common";
import SearchHistory from "src/Api/Entity/SearchHistory";
import SearchHistoryRepository from "src/Api/Repository/SearchHistoryRepository";
import SearchHistoryDto from "src/Api/Dto/SearchHistoryDto";

@Injectable()
export default class CreateSearchHistoryUseCase
  implements UseCase<Promise<SearchHistory>, [dto: SearchHistoryDto]>
{
  constructor(private readonly searchHistoryRepository: SearchHistoryRepository) {}

  async handle(
    context: ContextualGraphqlRequest,
    dto: SearchHistoryDto
  ): Promise<SearchHistory> {
    try {
      return await this.searchHistoryRepository.save({
        searchTerm: dto.searchTerm,
        searchDate: dto.searchDate,
        user: {
          connect: { id: dto.user.id },
        },
      });;
    } catch (error) {
      throw new BadRequestException(
        "CreateSearchHistoryUseCaseFailed",
        error.message
      );
    }
  }
}