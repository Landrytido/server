import { InputType, Field, Float } from "@nestjs/graphql";
import { ChronometerMode } from "@prisma/client";

@InputType()
export class StartChronometerDto {
  @Field()
  name: string;

  @Field(() => ChronometerMode)
  mode: ChronometerMode;

  @Field(() => Float, { nullable: true })
  duration?: number;
}