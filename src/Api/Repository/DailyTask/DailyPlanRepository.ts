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
    async confirmDay(userId: number, date: Date | string, confirmed: boolean = true): Promise<DailyPlan> {
        // Convert input to YYYY-MM-DD string if it's a Date
        const dateString = typeof date === 'string'
            ? date
            : date.toISOString().split('T')[0];

        console.log(`Confirming day for user: ${userId} on date string: ${dateString} with confirmed status: ${confirmed}`);

        // Find any existing plans for this date string
        const plans = await this.prisma.dailyPlan.findMany({
            where: { userId },
        });

        // Find a matching plan based on the date string
        const existingPlan = plans.find(plan => {
            const planDateString = plan.date.toISOString().split('T')[0];
            return planDateString === dateString;
        });

        if (existingPlan) {
            console.log(`Updating existing plan for ${dateString} with ID: ${existingPlan.id}`);
            return this.prisma.dailyPlan.update({
                where: { id: existingPlan.id },
                data: { confirmed },
            });
        }

        // Create a date object at UTC midnight for storage
        const storageDate = new Date(`${dateString}T00:00:00.000Z`);

        console.log(`Creating new plan for date: ${dateString} (storage format: ${storageDate.toISOString()})`);
        return this.prisma.dailyPlan.create({
            data: {
                date: storageDate, // Store as UTC midnight
                confirmed,
                user: { connect: { id: userId } },
            },

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
        // Convert to YYYY-MM-DD format for the specific day
        const dateString = date.toISOString().split('T')[0]; // Gets "YYYY-MM-DD"

        console.log("Looking for daily plan on date:", dateString);

        // Find plans where the date's YYYY-MM-DD string matches
        const plans = await this.prisma.dailyPlan.findMany({
            where: {
                userId,
            },
        });

        // Filter plans to find one that matches the target date string
        const matchingPlan = plans.find(plan => {
            const planDateString = plan.date.toISOString().split('T')[0];
            return planDateString === dateString;
        });

        return matchingPlan || null;
    }
}
