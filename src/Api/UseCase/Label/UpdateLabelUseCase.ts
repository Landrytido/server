import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { LabelRepository } from '../../Repository/LabelRepository';
import { Label } from '../../Entity/Label';
import { ContextualGraphqlRequest, UseCase } from 'src';

@Injectable()
export default class UpdateLabelUseCase
    implements UseCase<Promise<Label>, [id: string, name: string]>
{
    constructor(private readonly labelRepository: LabelRepository) {}

    async handle(
        context: ContextualGraphqlRequest, 
        id: string, 
        name: string
    ): Promise<Label> {
        try {
            const userId = context.userId;
            

            const label = await this.labelRepository.findById(id);
            if (!label) {
                throw new NotFoundException(`Label with id ${id} not found.`);
            }

            
            const belongsToUser = await this.labelRepository.belongsToUser(id, userId);
            if (!belongsToUser) {
                throw new ForbiddenException('You do not have permission to update this label.');
            }
            
            
            return await this.labelRepository.update(id, name);
        } catch (error) {
            if (error instanceof NotFoundException || 
                error instanceof ForbiddenException) {
                throw error;
            }
            throw new Error('Failed to update label: ' + error.message);
        }
    }
}