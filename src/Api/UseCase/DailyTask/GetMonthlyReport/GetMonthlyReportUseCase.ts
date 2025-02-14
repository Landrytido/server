// src/UseCase/DailyTask/GetMonthlyReport/GetMonthlyReportUseCase.ts
import { Injectable } from '@nestjs/common';
import { ContextualGraphqlRequest, UseCase } from '../../../../index';
import DailyTaskHistoryRepository from "../../../Repository/DailyTask/DailyTaskHistoryRepository";
import {MonthlyReport} from "../../../Entity/DailyTask/MonthlyReport";

@Injectable()
export default class GetMonthlyReportUseCase implements UseCase<Promise<MonthlyReport>, [year: number, month: number]> {
    constructor(private readonly historyRepository: DailyTaskHistoryRepository) {}

    async handle(context: ContextualGraphqlRequest, year: number, month: number): Promise<MonthlyReport> {
	  const { total, completed } = await this.historyRepository.getMonthlyReport(context.userId, year, month);
	  const notCompleted = total - completed;
	  const completionPercentage = total > 0 ? (completed / total) * 100 : 0;
	  return {
		totalTasks: total,
		completedTasks: completed,
		notCompletedTasks: notCompleted,
		completionPercentage,
	  };
    }
}
