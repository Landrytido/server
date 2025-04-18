import { Injectable } from '@nestjs/common';
import { LabelRepository } from '../../Repository/LabelRepository';
import { Label } from '../../Entity/Label';
import { ContextualGraphqlRequest, UseCase } from 'src';

@Injectable()
export default class GetAllLabelsUseCase
    implements UseCase<Promise<Label[]>, []>
{
    constructor(private readonly labelRepository: LabelRepository) {}

    async handle(context: ContextualGraphqlRequest): Promise<Label[]> {
        const userId = context.userId;
        return await this.labelRepository.findAll(userId);
    }
}