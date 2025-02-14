// src/Dto/DailyTaskDto/CombinedTaskDto.ts
import { Field, ObjectType, Int } from '@nestjs/graphql';

@ObjectType()
export class CombinedTaskDto {
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

    // Indicates the source of the record: either still active ("active") or archived ("archived").
    @Field()
    source: 'active' | 'archived';
}
