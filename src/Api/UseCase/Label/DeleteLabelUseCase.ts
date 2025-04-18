import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { LabelRepository } from '../../Repository/LabelRepository';
import { Label } from '../../Entity/Label';
import { ContextualGraphqlRequest, UseCase } from 'src';

@Injectable()
export default class DeleteLabelUseCase
    implements UseCase<Promise<{ label: Label, hasAssociatedNotes: boolean }>, [id: string, forceDelete?: boolean]>
{
    constructor(private readonly labelRepository: LabelRepository) {}

    async handle(
        context: ContextualGraphqlRequest, 
        id: string, 
        forceDelete = false
    ): Promise<{ label: Label, hasAssociatedNotes: boolean }> {
        try {
            const userId = context.userId;
            
     
            const label = await this.labelRepository.findById(id);
            if (!label) {
                throw new NotFoundException(`Label with id ${id} not found.`);
            }

          
            const belongsToUser = await this.labelRepository.belongsToUser(id, userId);
            if (!belongsToUser) {
                throw new ForbiddenException('You do not have permission to delete this label.');
            }

        
            const hasAssociatedNotes = await this.labelRepository.hasAssociatedNotes(id);
            
       
            if (hasAssociatedNotes && !forceDelete) {
                return { 
                    label, 
                    hasAssociatedNotes: true 
                };
            }
            
         
            const deletedLabel = await this.labelRepository.delete(id);
            return { 
                label: deletedLabel, 
                hasAssociatedNotes: hasAssociatedNotes 
            };
        } catch (error) {
            if (error instanceof NotFoundException || 
                error instanceof ForbiddenException) {
                throw error;
            }
            throw new Error('Failed to delete label: ' + error.message);
        }
    }
}