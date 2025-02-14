// src/Jobs/AutoConfirmEndOfDayJob.ts
import {Injectable, Logger} from '@nestjs/common';
import {Cron, CronExpression} from '@nestjs/schedule';
import DailyTaskRepository from '../Repository/DailyTask/DailyTaskRepository';
import DailyPlanRepository from '../Repository/DailyTask/DailyPlanRepository';
import {PrismaService} from '../../Core/Datasource/Prisma';
import User from "../Entity/User";

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
	  const today = new Date();
	  today.setHours(0, 0, 0, 0);
	  const tomorrow = new Date(today);
	  tomorrow.setDate(tomorrow.getDate() + 1);

	  try {
		// Récupère tous les utilisateurs (pour simplifier, on traite tous les utilisateurs)
		const allUsers = await this.prisma.user.findMany({
		    select: {id: true},
		});

		for (const user of allUsers) {
		    // Vérifie si un DailyPlan existe pour aujourd'hui et si la journée est confirmée.
		    const plan = await this.dailyPlanRepository.findPlanByUserAndDate(user.id, today);
		    if (!plan || plan.confirmed === false) {
			  // Si non confirmé, on auto-traite la fin de journée.
			  await this.dailyTaskRepository.confirmEndOfDay(user.id, today, tomorrow);
			  // Crée ou met à jour le DailyPlan pour indiquer que la confirmation s'est faite automatiquement.
			  await this.dailyPlanRepository.confirmDay(user.id, today, true);
			  this.logger.log(`Auto-confirmed end of day for user ${user.id}`);
		    }
		}
	  } catch (error) {
		this.logger.error('Error during auto confirm end of day', error.stack);
	  }
    }
}
