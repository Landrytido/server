import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class SaveScoreDto {

  @Field(() => Int, { nullable: true })
  userId?: number | null;

  @Field(() => Int)
  time: number;
}
