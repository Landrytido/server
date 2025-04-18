import { Injectable } from '@nestjs/common';
import { LabelRepository } from '../../Repository/LabelRepository';
import { Label } from '../../Entity/Label';
import { ContextualGraphqlRequest, UseCase } from 'src';

@Injectable()
export default class CreateLabelUseCase
    implements UseCase<Promise<Label>, [name: string]>
{
    constructor(private readonly labelRepository: LabelRepository) {}

    async handle(context: ContextualGraphqlRequest, name: string): Promise<Label> {
        const userId = context.userId;
        return await this.labelRepository.create(name, userId);
    }
}