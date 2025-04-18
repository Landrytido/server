// src/Dto/label/deleteLabelDto.ts
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class DeleteLabelInput {
    @Field()
    id: string;
    
    @Field(() => Boolean, { nullable: true, defaultValue: false })
    forceDelete?: boolean;
}