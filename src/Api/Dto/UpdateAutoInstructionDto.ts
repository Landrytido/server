import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateAutoInstructionInput {
  @Field()
  id: number;
  
  @Field()
  order: number;
  
  @Field()
  description: string;

}
