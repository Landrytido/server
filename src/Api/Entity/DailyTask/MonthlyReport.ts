// src/Entity/DailyTask/MonthlyReport.ts
import { ObjectType, Field, Int, Float } from '@nestjs/graphql';

@ObjectType()
export class MonthlyReport {
    // Nombre total de tâches (archivées) pour le mois sélectionné.
    @Field(() => Int)
    totalTasks: number;

    // Nombre de tâches complétées dans le mois.
    @Field(() => Int)
    completedTasks: number;

    // Nombre de tâches non complétées (total - complétées).
    @Field(() => Int)
    notCompletedTasks: number;

    // Pourcentage de complétion (complétées / total * 100).
    @Field(() => Float)
    completionPercentage: number;
}
