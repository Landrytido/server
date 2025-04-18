// src/Dto/label/DeleteLabelResponseDto.ts
import { ObjectType, Field } from '@nestjs/graphql';
import { Label } from '../../Entity/Label';

@ObjectType()
export class DeleteLabelResponse {
    @Field(() => Label)
    label: Label;

    @Field(() => Boolean)
    hasAssociatedNotes: boolean;
}