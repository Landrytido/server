import { Injectable, NotFoundException } from '@nestjs/common';
import {LabelRepository} from '../../Repository/LabelRepository';
import { Label } from '../../Entity/Label';
import { ContextualGraphqlRequest, UseCase } from 'src'; 

@Injectable()
export default class GetLabelByIdUseCase
    implements UseCase<Promise<Label>, [id: string]>
{
    constructor(private readonly labelRepository: LabelRepository) {} 

    async handle(context: ContextualGraphqlRequest, id: string): Promise<Label> {
        const label = await this.labelRepository.findById(id); 
        if (!label) {
            throw new NotFoundException(`Label with ID "${id}" not found`);
        }
        return label;
    }
}