import { Injectable, BadRequestException } from '@nestjs/common';
import { LabelRepository } from '../../Repository/LabelRepository'; 
import { Label } from '../../Entity/Label';
import { ContextualGraphqlRequest, UseCase } from 'src';
@Injectable()
export default class CreateLabelUseCase
    implements UseCase<Promise<Label>, [name: string]>
{
    constructor(private readonly labelRepository: LabelRepository) {} 

    async handle(context: ContextualGraphqlRequest, name: string): Promise<Label> {
        try {
            return await this.labelRepository.create(name); 
        } catch (error) {
            if (error.code === 'P2002') {
                throw new BadRequestException('Label name already exists.');
            }
            throw new BadRequestException('Failed to create label.', error.message);
        }
    }
}