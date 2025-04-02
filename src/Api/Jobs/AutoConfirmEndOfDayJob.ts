// src/Jobs/AutoConfirmEndOfDayJob.ts
import {Injectable, Logger} from '@nestjs/common';
import {Cron, CronExpression} from '@nestjs/schedule';
import DailyTaskRepository from '../Repository/DailyTask/DailyTaskRepository';
import DailyPlanRepository from '../Repository/DailyTask/DailyPlanRepository';
import {PrismaService} from '../../Core/Datasource/Prisma';

@Injectable()
export class AutoConfirmEndOfDayJob {
    private readonly logger = new Logger(AutoConfirmEndOfDayJob.name);

    constructor(
	    private readonly prisma: PrismaService,
	    private readonly dailyTaskRepository: DailyTaskRepository,
	    private readonly dailyPlanRepository: DailyPlanRepository,
    ) {
    }

	@Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
	async handleAutoConfirmEndOfDay(): Promise<void> {
		console.log('Auto-confirm end of day job started');

		// Get current date as YYYY-MM-DD string
		const now = new Date();
		const todayString = now.toISOString().split('T')[0];
		const today = new Date(`${todayString}T00:00:00.000Z`);

		// Calculate tomorrow's date string
		const tomorrowDate = new Date(now);
		tomorrowDate.setDate(tomorrowDate.getDate() + 1);
		const tomorrowString = tomorrowDate.toISOString().split('T')[0];

		console.log(`Auto-confirming day: ${todayString}, preparing for: ${tomorrowString}`);

		try {
			const allUsers = await this.prisma.user.findMany({
				select: {id: true},
			});

			for (const user of allUsers) {
				// Check if a DailyPlan exists for today and if it's confirmed
				const plan = await this.dailyPlanRepository.findPlanByUserAndDate(user.id, new Date(todayString));
				if (!plan || plan.confirmed === false) {
					// If not confirmed, process end of day
					await this.dailyTaskRepository.confirmEndOfDay(user.id, today, tomorrowDate);
					// Create or update DailyPlan to mark the day as automatically confirmed
					await this.dailyPlanRepository.confirmDay(user.id, todayString, true);
					this.logger.log(`Auto-confirmed end of day for user ${user.id}`);
				}
			}
		} catch (error) {
			this.logger.error('Error during auto confirm end of day', error.stack);
		}
	}
}
