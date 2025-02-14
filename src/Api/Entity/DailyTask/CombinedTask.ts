// src/Entity/DailyTask/CombinedTask.ts
import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class CombinedTask {
    @Field(() => Int)
    id: number;

    @Field()
    title: string;

    @Field({ nullable: true })
    description?: string;

    @Field()
    scheduledDate: Date;

    @Field()
    createdAt: Date;

    @Field()
    completed: boolean;

    @Field({ nullable: true })
    completedAt?: Date;

    @Field()
    carriedOver: boolean;

    @Field({nullable: true})
    priority: number

    /**
     * Indicates the source of the record: either "active" for records
     * that are still in the DailyTask table, or "archived" for records
     * that have been moved to the DailyTaskHistory table.
     */
    @Field()
    source: 'active' | 'archived';
}
