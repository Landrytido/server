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

  @Field() // Ajout du prénom
  firstName: string;

  @Field() // Ajout du nom
  lastName: string;
}

