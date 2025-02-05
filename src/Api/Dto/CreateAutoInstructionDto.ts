import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreateAutoInstructionInput {  
  @Field()
  description: string;

  @Field()
  order: number;

  @Field()
  userId: number;
}

// auto-instruction.input.ts

@InputType()
export class AutoInstructionInput {
  @Field()
  id: number;

  @Field()
  order: number;
}
