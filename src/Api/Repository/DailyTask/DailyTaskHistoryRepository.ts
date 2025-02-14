// src/Repository/DailyTask/DailyTaskHistoryRepository.ts
import { Injectable } from '@nestjs/common';
import { DailyTaskHistory } from '@prisma/client';
import {PrismaService} from "../../../Core/Datasource/Prisma";

@Injectable()
export default class DailyTaskHistoryRepository {
    constructor(private readonly prisma: PrismaService) {}

    /**
     * Récupère l'historique des tâches d'un utilisateur pour une date donnée.
     *
     * @param userId - L'ID de l'utilisateur.
     * @param date - La date ciblée (on filtre sur scheduledDate).
     * @returns La liste des tâches archivées pour cette date.
     */
    async findHistoryByUserAndDate(userId: number, date: Date): Promise<DailyTaskHistory[]> {
	  const start = new Date(date);
	  start.setHours(0, 0, 0, 0);
	  const end = new Date(date);
	  end.setHours(23, 59, 59, 999);
	  return this.prisma.dailyTaskHistory.findMany({
		where: {
		    userId,
		    scheduledDate: {
			  gte: start,
			  lte: end,
		    },
		},
		orderBy: { order: 'asc' },
	  });
    }

    /**
     * Retrieves aggregated monthly report data.
     *
     * Counts tasks from both the archived history and from tasks that may still be in DailyTask,
     * within the given month.
     *
     * @param userId - The user's ID.
     * @param year - The year (e.g., 2025).
     * @param month - The month (1-indexed; e.g., 2 for February).
     * @returns An object with total tasks and completed tasks.
     */
    async getMonthlyReport(userId: number, year: number, month: number): Promise<{ total: number; completed: number; }> {
	  // Define the date range for the month.
	  const start = new Date(year, month - 1, 1);
	  const end = new Date(year, month, 0, 23, 59, 59, 999);

	  // Count tasks in the history table.
	  const historyTotal = await this.prisma.dailyTaskHistory.count({
		where: {
		    userId,
		    scheduledDate: { gte: start, lte: end },
		},
	  });
	  const historyCompleted = await this.prisma.dailyTaskHistory.count({
		where: {
		    userId,
		    scheduledDate: { gte: start, lte: end },
		    completed: true,
		},
	  });

	  // Also count tasks still in DailyTask (if any) that are scheduled within this month.
	  const dailyTotal = await this.prisma.dailyTask.count({
		where: {
		    userId,
		    scheduledDate: { gte: start, lte: end },
		},
	  });
	  const dailyCompleted = await this.prisma.dailyTask.count({
		where: {
		    userId,
		    scheduledDate: { gte: start, lte: end },
		    completed: true,
		},
	  });

	  const total = historyTotal + dailyTotal;
	  const completed = historyCompleted + dailyCompleted;
	  return { total, completed };
    }
}
