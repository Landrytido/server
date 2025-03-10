import { Field, InputType, Int, Float } from "@nestjs/graphql";
import { ChronometerMode } from "@prisma/client";

@InputType()
export class UpdateChronometerDto {
  @Field({ nullable: true })
  name?: string;

  @Field(() => ChronometerMode, { nullable: true })
  mode?: ChronometerMode;

  @Field({ nullable: true })
  startTime?: Date;

  @Field(() => Int, { nullable: true })
  elapsedTime?: number;

  @Field(() => Float, { nullable: true })
  duration?: number;

  @Field({ nullable: true })
  isRunning?: boolean;
}
