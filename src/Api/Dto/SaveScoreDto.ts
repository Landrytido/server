import { Field, InputType, Int } from '@nestjs/graphql';
import { Level } from '@prisma/client';

@InputType()
export class SaveScoreDto {
  @Field(() => Int)
  userId: number;

  @Field(() => Int)
  time: number;

  @Field(() => Level)
  level: Level;

  @Field(() => String)
  firstName: string;

  @Field(() => String)
  lastName: string;
}