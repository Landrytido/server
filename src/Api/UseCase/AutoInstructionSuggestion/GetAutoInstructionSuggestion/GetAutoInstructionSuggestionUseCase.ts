import {Injectable} from '@nestjs/common';
import {ContextualGraphqlRequest, UseCase} from '../../../../index';
import {AutoInstructionSuggestion} from '@prisma/client';
import {
    AutoInstructionSuggestionRepository
} from "../../../Repository/AutoInstructionSuggestion/AutoInstructionSuggestionRepository";

@Injectable()
export default class GetAutoInstructionSuggestionUseCase implements UseCase<Promise<AutoInstructionSuggestion>, [id: number]> {
    constructor(private readonly autoInstructionSuggestionRepository: AutoInstructionSuggestionRepository) {
    }

    async handle(_context: ContextualGraphqlRequest, id: number): Promise<AutoInstructionSuggestion> {
	  return this.autoInstructionSuggestionRepository.getById(id);
    }
}
