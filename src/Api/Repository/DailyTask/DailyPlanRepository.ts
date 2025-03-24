// src/Repository/DailyTask/DailyPlanRepository.ts
import {Injectable} from '@nestjs/common';
import {PrismaService} from '../../../Core/Datasource/Prisma';
import {DailyPlan} from '@prisma/client';

@Injectable()
export default class DailyPlanRepository {
    constructor(private readonly prisma: PrismaService) {
    }

    /**
     * Crée ou met à jour le DailyPlan pour une date donnée en indiquant si la journée est confirmée.
     */
    async confirmDay(userId: number, date: Date, confirmed: boolean = true): Promise<DailyPlan> {
        return this.prisma.dailyPlan.upsert({
            where: {
                date_userId: {  // This matches the compound unique constraint
                    date: date,
                    userId
                }
            },
            update: {
                confirmed
            },
            create: {
                date: date,
                confirmed,
                userId  // Directly set userId instead of using connect
            }
        });
    }

    /**
     * Récupère le plan d’une journée pour un utilisateur.
     */
    async findPlanByUserAndDate(userId: number, date: Date): Promise<DailyPlan | null> {
        return this.prisma.dailyPlan.findFirst({
            where: {userId, date},
        });
    }

    /**
     * Retrieves the DailyPlan for the given user and date.
     *
     * @param userId The user's ID.
     * @param date The date for which to retrieve the plan (normalized to midnight).
     * @returns The DailyPlan record, or null if none exists.
     */
    async getPlanByUserAndDate(userId: number, date: Date): Promise<DailyPlan | null> {
        // Normalize the date to midnight.
        const normalizedDate = new Date(date);
        normalizedDate.setHours(0, 0, 0, 0);

        return this.prisma.dailyPlan.findFirst({
            where: {
                userId,
                date: normalizedDate,
            },
        });
    }
}
