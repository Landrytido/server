import { Field, ObjectType, Int } from '@nestjs/graphql';

@ObjectType()
export class ChronometerDto {
  @Field()
  id: string;

  @Field({ nullable: true })
  startTime?: Date;

  @Field(() => Int)
  elapsedTime: number;

  @Field()
  mode: 'countdown' | 'stopwatch';

  @Field(() => Int, { nullable: true })
  duration?: number;

  @Field()
  isRunning: boolean;
}
