// src/Repository/DailyTask/DailyTaskRepository.ts

import {Injectable, BadRequestException} from '@nestjs/common';
import {PrismaService} from "../../../Core/Datasource/Prisma";
import {CreateDailyTaskDto} from "../../Dto/DailyTaskDto/CreateDailyTaskDto";
import {DailyTask} from "@prisma/client";
import {UpdateDailyTaskDto} from "../../Dto/DailyTaskDto/UpdateDailyTaskDto";
import {CombinedTaskDto} from "../../Dto/DailyTaskDto/CombinedTaskDto";
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export default class DailyTaskRepository {
    constructor(private readonly prisma: PrismaService) {
    }

    /**
     * Creates a new daily task.
     *
     * - Normalizes the scheduledDate to midnight.
     * - If the task is scheduled for tomorrow, verifies that the number of tasks does not exceed 6.
     * - If no order is provided, assigns an order that is one more than the current highest order.
     *
     * @param userId The ID of the user creating the task.
     * @param dto The data transfer object containing task details.
     * @returns The created DailyTask.
     */
    async create(userId: number, dto: CreateDailyTaskDto): Promise<DailyTask> {
	  const scheduledDate = dto.scheduledDate ? new Date(dto.scheduledDate) : new Date();
	  scheduledDate.setHours(0, 0, 0, 0);

	  const today = new Date();
	  today.setHours(0, 0, 0, 0);
	  if (scheduledDate.getTime() > today.getTime()) {
		const count = await this.countTasksByUserAndDate(userId, scheduledDate);
		if (count >= 6) {
		    throw new BadRequestException('You cannot plan more than 6 tasks for tomorrow.');
		}
	  }

	  let order = dto.order;
	  if (order === undefined) {
		const lastTask = await this.prisma.dailyTask.findFirst({
		    where: { userId, scheduledDate },
		    orderBy: { order: 'desc' },
		});
		order = lastTask ? lastTask.order + 1 : 1;
	  }

	  const uniqueTaskId = dto.uniqueTaskId || uuidv4();

	  return this.prisma.dailyTask.create({
		data: {
		    uniqueTaskId,
		    title: dto.title,
		    description: dto.description,
		    scheduledDate: scheduledDate,
		    order,
		    priority: dto.priority,
		    user: { connect: { id: userId } },
		},
	  });
    }

    /**
     * Updates an existing daily task.
     *
     * @param userId The user's ID.
     * @param id The ID of the task to update.
     * @param dto The update DTO with new values.
     * @returns The updated DailyTask.
     */
    async update(userId: number, id: number, dto: UpdateDailyTaskDto): Promise<DailyTask> {
	  const updateData: any = {
		title: dto.title,
		description: dto.description,
		scheduledDate: dto.scheduledDate ? new Date(dto.scheduledDate) : undefined,
		order: dto.order,
		priority: dto.priority,
		completed: dto.completed,
	  };

	  if (dto.completed !== undefined) {
		updateData.completedAt = dto.completed ? new Date() : null;
	  }

	  return this.prisma.dailyTask.update({
		where: {id},
		data: updateData,
	  });
    }

    /**
     * Deletes a daily task.
     *
     * @param userId The user's ID.
     * @param id The ID of the task to delete.
     * @returns The deleted DailyTask.
     */
    async delete(userId: number, id: number): Promise<DailyTask> {
	  return this.prisma.dailyTask.delete({
		where: {id},
	  });
    }

    /**
     * Retrieves all tasks for a user scheduled on a specific date.
     * The date is normalized from start of day to end of day.
     *
     * @param userId The user's ID.
     * @param date The target date.
     * @returns An array of DailyTask.
     */
    async findByUserAndDate(userId: number, date: Date): Promise<DailyTask[]> {
	  const start = new Date(date);
	  start.setHours(0, 0, 0, 0);
	  const end = new Date(date);
	  end.setHours(23, 59, 59, 999);
	  return this.prisma.dailyTask.findMany({
		where: {
		    userId,
		    scheduledDate: {gte: start, lte: end},
		},
		orderBy: {order: 'asc'},
	  });
    }

    /**
     * Counts the number of tasks for a user scheduled on a specific date.
     *
     * @param userId The user's ID.
     * @param date The target date.
     * @returns The count of tasks.
     */
    async countTasksByUserAndDate(userId: number, date: Date): Promise<number> {
	  const start = new Date(date);
	  start.setHours(0, 0, 0, 0);
	  const end = new Date(date);
	  end.setHours(23, 59, 59, 999);
	  return this.prisma.dailyTask.count({
		where: {
		    userId,
		    scheduledDate: {gte: start, lte: end},
		},
	  });
    }

    /**
     * Reorders tasks based on an array of ordered IDs.
     *
     * @param userId The user's ID.
     * @param orderedIds An array of task IDs in the desired order.
     * @returns An array of DailyTask with updated order values.
     */
    async reorder(userId: number, orderedIds: number[]): Promise<DailyTask[]> {
	  const updatedTasks: DailyTask[] = [];
	  for (let i = 0; i < orderedIds.length; i++) {
		const id = orderedIds[i];
		const updatedTask = await this.prisma.dailyTask.update({
		    where: {id},
		    data: {order: i + 1},
		});
		updatedTasks.push(updatedTask);
	  }
	  return updatedTasks;
    }

    /**
     * Moves a task to history:
     * - Creates a new record in DailyTaskHistory with the task's data.
     * - Deletes the task from the DailyTask table.
     *
     * @param task The DailyTask to be archived.
     */
    async moveToHistory(task: DailyTask): Promise<void> {
	  // Check if a history record with the same uniqueTaskId already exists.
	  const existingHistoryTask = await this.prisma.dailyTaskHistory.findFirst({
		where: { uniqueTaskId: task.uniqueTaskId },
	  });

	  if (existingHistoryTask) {
		// For the boolean fields, if either is true, result should be true.
		const updatedCarriedOver = task.carriedOver || existingHistoryTask.carriedOver;
		const updatedCompleted = task.completed || existingHistoryTask.completed;

		// For completedAt, if one is null and the other has a date, keep the non-null date.
		// If both have a date, we'll take the new one (adjust as needed).
		const updatedCompletedAt = task.completedAt ?? existingHistoryTask.completedAt;

		await this.prisma.dailyTaskHistory.update({
		    where: { id: existingHistoryTask.id },
		    data: {
			  title: task.title,
			  description: task.description,
			  scheduledDate: task.scheduledDate,
			  originalDate: task.originalDate,
			  carriedOver: updatedCarriedOver,
			  order: task.order,
			  priority: task.priority,
			  completed: updatedCompleted,
			  completedAt: updatedCompletedAt,
			  user: { connect: { id: task.userId } },
			  archivedAt: new Date(),
			  createdAt: task.createdAt, // Preserve original creation date.
		    },
		});
	  } else {
		await this.prisma.dailyTaskHistory.create({
		    data: {
			  uniqueTaskId: task.uniqueTaskId,
			  title: task.title,
			  description: task.description,
			  scheduledDate: task.scheduledDate,
			  originalDate: task.originalDate,
			  carriedOver: task.carriedOver,
			  order: task.order,
			  priority: task.priority,
			  completed: task.completed,
			  completedAt: task.completedAt,
			  user: { connect: { id: task.userId } },
			  archivedAt: new Date(),
			  createdAt: task.createdAt, // Preserve original creation date.
		    },
		});
	  }

	  // Finally, remove the task from the dailyTask table.
	  await this.prisma.dailyTask.delete({
		where: { id: task.id },
	  });
    }


    /**
     * Confirms end-of-day processing.
     *
     * For each task scheduled for today:
     *  - If completed, the task is moved to history.
     *  - If not completed, the task is archived (to preserve the record) and then updated
     *    to be scheduled for tomorrow, with carriedOver set to true.
     *
     * Finally, all tasks scheduled for tomorrow are retrieved and automatically reordered
     * using the default logic: carried-over tasks come first, then by ascending priority.
     *
     * @param userId The user's ID.
     * @param today Date representing today (normalized to midnight).
     * @param tomorrow Date representing tomorrow (normalized to midnight).
     * @returns The number of tasks processed.
     */
    async confirmEndOfDay(userId: number, today: Date, tomorrow: Date): Promise<number> {
	  // Retrieve all tasks scheduled for today.
	  const todaysTasks = await this.findByUserAndDate(userId, today);
	  let processedCount = 0;

	  for (const task of todaysTasks) {
		if (task.completed) {
		    // Archive completed tasks.
		    await this.moveToHistory(task);
		} else {
		    // Archive the not-completed task (to preserve the daily record).
		    await this.prisma.dailyTaskHistory.create({
			  data: {
				uniqueTaskId: task.uniqueTaskId,
				title: task.title,
				description: task.description,
				scheduledDate: task.scheduledDate,
				originalDate: task.originalDate,
				carriedOver: task.carriedOver,
				order: task.order,
				priority: task.priority,
				completed: false,
				completedAt: null,
				user: {connect: {id: task.userId}},
				archivedAt: new Date(),
				createdAt: task.createdAt, // Preserve the original creation date.
			  },
		    });
		    // Update the task so it is rescheduled for tomorrow,
		    // mark it as carried over, and reset its order (to be recalculated later).
		    await this.prisma.dailyTask.update({
			  where: {id: task.id},
			  data: {
				scheduledDate: tomorrow,
				carriedOver: true,
				order: 0, // Temporary value; will be updated in reordering.
			  },
		    });
		}
		processedCount++;
	  }

	  // After processing, retrieve all tasks scheduled for tomorrow.
	  const tomorrowTasks = await this.findByUserAndDate(userId, tomorrow);

	  // Sort the tasks:
	  //   - Carried-over tasks come first.
	  //   - Then, tasks are sorted by ascending priority.
	  const sortedTasks = tomorrowTasks.sort((a, b) => {
		if (a.carriedOver && !b.carriedOver) return -1;
		if (!a.carriedOver && b.carriedOver) return 1;
		return a.priority - b.priority;
	  });

	  // Update the order field for each task based on the sorted order.
	  for (let i = 0; i < sortedTasks.length; i++) {
		await this.prisma.dailyTask.update({
		    where: {id: sortedTasks[i].id},
		    data: {order: i + 1},
		});
	  }

	  return processedCount;
    }

    /**
     * Retrieves all tasks that were created on a given day, regardless of their current status.
     *
     * This method fetches tasks from both the active DailyTask table and the archived
     * DailyTaskHistory table, filtering them by their createdAt timestamp. It then
     * deduplicates the results based on the uniqueTaskId field.
     *
     * @param userId The user's ID.
     * @param date The day to filter by (using the createdAt date).
     * @returns An array of CombinedTaskDto containing tasks from both sources, deduplicated.
     */
    async getTasksCreatedOn(userId: number, date: Date): Promise<CombinedTaskDto[]> {
	  // Define the date range for the given day (from midnight to 23:59:59.999)
	  const start = new Date(date);
	  start.setHours(0, 0, 0, 0);
	  const end = new Date(date);
	  end.setHours(23, 59, 59, 999);

	  // Retrieve active tasks created on the given day.
	  const activeTasks = await this.prisma.dailyTask.findMany({
		where: {
		    userId,
		    createdAt: { gte: start, lte: end },
		},
	  });

	  // Retrieve archived tasks (from DailyTaskHistory) created on the given day.
	  const archivedTasks = await this.prisma.dailyTaskHistory.findMany({
		where: {
		    userId,
		    createdAt: { gte: start, lte: end },
		},
	  });

	  // Use a Map to deduplicate tasks by their uniqueTaskId.
	  const deduped = new Map<string, CombinedTaskDto>();

	  activeTasks.forEach(task => {
		// We assume that the active task has a property 'uniqueTaskId'
		deduped.set(task.uniqueTaskId, {
		    id: task.id,
		    title: task.title,
		    priority: task.priority,
		    description: task.description,
		    scheduledDate: task.scheduledDate,
		    createdAt: task.createdAt,
		    completed: task.completed,
		    completedAt: task.completedAt,
		    carriedOver: task.carriedOver,
		    source: 'active',
		});
	  });

	  archivedTasks.forEach(task => {
		// Only add the archived task if we haven't already seen the same uniqueTaskId
		if (!deduped.has(task.uniqueTaskId)) {
		    deduped.set(task.uniqueTaskId, {
			  id: task.id,
			  title: task.title,
			  priority: task.priority,
			  description: task.description,
			  scheduledDate: task.scheduledDate,
			  createdAt: task.createdAt,
			  completed: task.completed,
			  completedAt: task.completedAt,
			  carriedOver: task.carriedOver,
			  source: 'archived',
		    });
		}
	  });

	  // Convert the Map values to an array and sort by createdAt (ascending).
	  const combinedArray = Array.from(deduped.values());
	  combinedArray.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

	  return combinedArray;
    }


}
