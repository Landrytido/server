// src/Dto/DailyTaskDto/CreateDailyTaskDto.ts
import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateDailyTaskDto {
    // Optionally accept a uniqueTaskId (if not provided, it will be generated)
    @Field({ nullable: true })
    uniqueTaskId?: string;

    @Field()
    title: string;

    @Field({ nullable: true })
    description?: string;

    /**
     * The date for which the task is planned. If not provided, the current day is used.
     */
    @Field({ nullable: true })
    scheduledDate?: Date;

    /**
     * Optional order; if not provided, the system assigns one.
     */
    @Field({ nullable: true })
    order?: number;

    /**
     * Priority (1 = high, 2 = medium, etc.)
     */
    @Field(() => Int)
    priority: number;
}
