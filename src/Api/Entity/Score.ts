import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Level } from '@prisma/client';

@ObjectType()
export class Score {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  userId: number;

  @Field(() => Int)
  time: number;

  @Field(() => Level)
  level: Level;

  @Field()
  createdAt: Date;

  @Field() 
  firstName: string;

  @Field() 
  lastName: string;
}

