// src/Dto/DailyTaskDto/ReorderDailyTasksDto.ts
import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class ReorderDailyTasksDto {
    /**
     * Un tableau d’IDs représentant le nouvel ordre de la liste.
     */
    @Field(() => [Int])
    orderedIds: number[];
}
