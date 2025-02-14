// src/Entity/DailyTask/DailyPlan.ts
import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class DailyPlan {
    @Field(() => Int)
    id: number;

    // The date corresponding to the day that was closed.
    @Field()
    date: Date;

    // A flag indicating whether the day was manually confirmed as finished.
    @Field()
    confirmed: boolean;

    @Field(() => Int)
    userId: number;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
}
