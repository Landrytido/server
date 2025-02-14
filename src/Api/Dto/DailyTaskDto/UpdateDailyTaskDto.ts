// src/Dto/DailyTaskDto/UpdateDailyTaskDto.ts
import {InputType, Field, Int} from '@nestjs/graphql';

@InputType()
export class UpdateDailyTaskDto {
    @Field({nullable: true})
    title?: string;

    @Field({nullable: true})
    description?: string;

    /**
     * Optionnel: Permet de modifier la date planifiée.
     */
    @Field({nullable: true})
    scheduledDate?: Date;

    @Field({nullable: true})
    order?: number;

    @Field(() => Int, {nullable: true})
    priority?: number;

    /**
     * Si passé à true, la tâche est marquée comme complétée.
     */
    @Field({nullable: true})
    completed?: boolean;
}
