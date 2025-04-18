import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateLabelInput {
    @Field()
    id: string;
    
    @Field()
    name: string;
}