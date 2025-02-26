import { Field, ObjectType, Int, Float } from "@nestjs/graphql";

@ObjectType()
export class ChronometerDto {
  @Field()
  id: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  startTime?: Date;

  @Field(() => Int)
  elapsedTime: number;

  @Field()
  mode: "countdown" | "stopwatch";

  @Field(() => Float, { nullable: true })
  duration?: number;

  @Field()
  isRunning: boolean;

  @Field(() => Int)
  userId: number;
}
