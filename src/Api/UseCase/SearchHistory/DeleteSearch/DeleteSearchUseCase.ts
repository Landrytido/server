// DeleteSearchHistoryUseCase.ts

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ContextualGraphqlRequest } from 'src';
import SearchHistoryRepository from 'src/Api/Repository/SearchHistoryRepository';

@Injectable()
export default class DeleteSearchHistoryUseCase {
  constructor(private readonly searchHistoryRepository: SearchHistoryRepository) {}

  async handle(context : ContextualGraphqlRequest, searchHistoryId: number): Promise<void> {
    try {
      await this.searchHistoryRepository.remove(searchHistoryId);
    } catch (error) {
      throw new InternalServerErrorException('An error occurred while deleting the search history');
    }
  }
}
