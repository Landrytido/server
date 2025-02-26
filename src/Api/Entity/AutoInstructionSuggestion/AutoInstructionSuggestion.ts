import { ObjectType, Field, Int } from "@nestjs/graphql";

@ObjectType()
export class AutoInstructionSuggestion {
  @Field(() => Int)
  id: number;

  @Field()
  description: string;
}
