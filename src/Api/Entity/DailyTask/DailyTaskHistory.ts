// src/Entity/DailyTask/DailyTaskHistory.ts
import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class DailyTaskHistory {
    @Field(() => Int)
    id: number;

    @Field()
    title: string;

    @Field({ nullable: true })
    description?: string;

    @Field()
    scheduledDate: Date;

    @Field({ nullable: true })
    originalDate?: Date;

    @Field()
    carriedOver: boolean;

    @Field(() => Int)
    order: number;

    @Field(() => Int)
    priority: number;

    @Field()
    completed: boolean;

    @Field({ nullable: true })
    completedAt?: Date;

    @Field(() => Int)
    userId: number;

    @Field()
    archivedAt: Date;

    @Field()
    createdAt: Date;  // <-- Added field for GraphQL
}
