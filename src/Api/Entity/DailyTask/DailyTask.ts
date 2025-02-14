// src/Entity/DailyTask/DailyTask.ts
import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export default class DailyTask {
    @Field(() => Int)
    id: number;

    @Field()
    title: string;

    @Field({ nullable: true })
    description?: string;

    @Field()
    scheduledDate: Date;

    @Field(() => Int)
    order: number;

    @Field(() => Int)
    priority: number;

    @Field()
    completed: boolean;

    @Field({ nullable: true })
    completedAt?: Date;

    @Field()
    carriedOver: boolean;

    @Field(() => Int)
    userId: number;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
}
