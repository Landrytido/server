import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Score {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  userId: number;

  @Field(() => Int)
  time: number;

  @Field()
  createdAt: Date;
}
