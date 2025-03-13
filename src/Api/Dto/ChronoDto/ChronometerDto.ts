import { Field, ObjectType, Int, Float } from "@nestjs/graphql";
import { ChronometerMode } from "@prisma/client";

@ObjectType()
export class ChronometerDto {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  startTime?: Date;

  @Field(() => Int)
  elapsedTime: number;

  @Field(() => ChronometerMode)
  mode: ChronometerMode;

  @Field(() => Float, { nullable: true })
  duration?: number;

  @Field()
  isRunning: boolean;

  @Field(() => Int)
  userId: number;
}
