import { ObjectType, Field, Int } from "@nestjs/graphql";

@ObjectType()
export class AutoInstruction {
  @Field(() => Int)
  id: number;

  @Field()
  description: string;

  @Field()
  order: number;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
