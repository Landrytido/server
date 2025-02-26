import {Injectable} from '@nestjs/common';
import {ContextualGraphqlRequest, UseCase} from '../../../../index';
import {AutoInstructionSuggestion} from '@prisma/client';
import {
    AutoInstructionSuggestionRepository
} from "../../../Repository/AutoInstructionSuggestion/AutoInstructionSuggestionRepository";

@Injectable()
export default class GetAllAutoInstructionSuggestionUseCase implements UseCase<Promise<AutoInstructionSuggestion[]>, []> {
    constructor(private readonly autoInstructionSuggestionRepository: AutoInstructionSuggestionRepository) {
    }

    async handle(_context: ContextualGraphqlRequest): Promise<AutoInstructionSuggestion[]> {
	  return this.autoInstructionSuggestionRepository.getAll();
    }
}
