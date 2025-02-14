// src/Resolver/DailyTask/DailyTaskResolver.ts
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import DailyTask from '../../Entity/DailyTask/DailyTask';
import GraphqlAuthGuard from '../../../Core/Security/Guard/GraphqlAuthGuard';
import UseCaseFactory from '../../UseCase/UseCaseFactory';
import { ContextualRequest } from '../../../Core/Decorator/ContextualRequest';
import CreateDailyTaskUseCase from '../../UseCase/DailyTask/CreateDailyTask/CreateDailyTaskUseCase';
import GetDailyTasksUseCase from '../../UseCase/DailyTask/GetDailyTasks/GetDailyTasksUseCase';
import UpdateDailyTaskUseCase from '../../UseCase/DailyTask/UpdateDailyTask/UpdateDailyTaskUseCase';
import DeleteDailyTaskUseCase from '../../UseCase/DailyTask/DeleteDailyTask/DeleteDailyTaskUseCase';
import ReorderDailyTasksUseCase from '../../UseCase/DailyTask/ReorderDailyTasks/ReorderDailyTasksUseCase';
import ConfirmEndOfDayUseCase from '../../UseCase/DailyTask/ConfirmEndOfDay/ConfirmEndOfDayUseCase';
import { ContextualGraphqlRequest as CtxRequest } from '../../../index';
import { CreateDailyTaskDto } from '../../Dto/DailyTaskDto/CreateDailyTaskDto';
import { UpdateDailyTaskDto } from '../../Dto/DailyTaskDto/UpdateDailyTaskDto';
import { ReorderDailyTasksDto } from '../../Dto/DailyTaskDto/ReorderDailyTasksDto';
import {CombinedTask} from "../../Entity/DailyTask/CombinedTask";
import GetTasksCreatedOnUseCase from "../../UseCase/DailyTask/GetTasksCreatedOn/GetTasksCreatedOnUseCase";
import {DailyPlan} from "../../Entity/DailyTask/DailyPlan";
import GetDailyPlanUseCase from "../../UseCase/DailyTask/GetDailyPlan/GetDailyPlanUseCase";

@Resolver(() => DailyTask)
export default class DailyTaskResolver {
    constructor(private readonly useCaseFactory: UseCaseFactory) {}

    @UseGuards(GraphqlAuthGuard)
    @Mutation(() => DailyTask)
    async createDailyTask(
	    @ContextualRequest() context: CtxRequest,
	    @Args('dto') dto: CreateDailyTaskDto,
    ): Promise<DailyTask> {
	  return (await this.useCaseFactory.create(CreateDailyTaskUseCase))
		  .handle(context, dto);
    }

    @UseGuards(GraphqlAuthGuard)
    @Mutation(() => DailyTask)
    async updateDailyTask(
	    @ContextualRequest() context: CtxRequest,
	    @Args('id', { type: () => Int }) id: number,
	    @Args('dto') dto: UpdateDailyTaskDto,
    ): Promise<DailyTask> {
	  return (await this.useCaseFactory.create(UpdateDailyTaskUseCase))
		  .handle(context, id, dto);
    }

    @UseGuards(GraphqlAuthGuard)
    @Mutation(() => DailyTask)
    async deleteDailyTask(
	    @ContextualRequest() context: CtxRequest,
	    @Args('id', { type: () => Int }) id: number,
    ): Promise<DailyTask> {
	  return (await this.useCaseFactory.create(DeleteDailyTaskUseCase))
		  .handle(context, id);
    }

    @UseGuards(GraphqlAuthGuard)
    @Query(() => [DailyTask])
    async getDailyTasks(
	    @ContextualRequest() context: CtxRequest,
	    @Args('date', { nullable: true }) date?: string,
    ): Promise<DailyTask[]> {
	  const targetDate = date ? new Date(date) : new Date();
	  return (await this.useCaseFactory.create(GetDailyTasksUseCase))
		  .handle(context, targetDate);
    }

    @UseGuards(GraphqlAuthGuard)
    @Mutation(() => [DailyTask])
    async reorderDailyTasks(
	    @ContextualRequest() context: CtxRequest,
	    @Args('dto') dto: ReorderDailyTasksDto,
    ): Promise<DailyTask[]> {
	  return (await this.useCaseFactory.create(ReorderDailyTasksUseCase))
		  .handle(context, dto);
    }

    /**
     * Mutation to manually confirm the end of day.
     * This mutation triggers:
     *  - Archiving of completed tasks,
     *  - Carrying over incomplete tasks to tomorrow,
     *  - And automatic reordering of tomorrow’s tasks.
     */
    @UseGuards(GraphqlAuthGuard)
    @Mutation(() => Boolean)
    async confirmEndOfDay(
	    @ContextualRequest() context: CtxRequest,
    ): Promise<boolean> {
	  return (await this.useCaseFactory.create(ConfirmEndOfDayUseCase))
		  .handle(context);
    }

    /**
     * Query to retrieve all tasks created on a specific day.
     * This returns both active tasks (from DailyTask) and archived tasks (from DailyTaskHistory).
     *
     * @param context
     * @param date A string representing the target date (e.g. "2025-02-12").
     * @returns An array of CombinedTask records.
     */
    @UseGuards(GraphqlAuthGuard)
    @Query(() => [CombinedTask])
    async getTasksCreatedOn(
	    @ContextualRequest() context: CtxRequest,
	    @Args('date', { type: () => String }) date: string,
    ): Promise<CombinedTask[]> {
	  const targetDate = new Date(date);
	  return (await this.useCaseFactory.create(GetTasksCreatedOnUseCase))
		  .handle(context, targetDate);
    }

    /**
     * Query to retrieve the DailyPlan for a given day.
     * This allows the client to know whether a day has been finished (confirmed) or not.
     *
     * @param context
     * @param date A string representing the target date (e.g. "2025-02-12").
     * @returns The DailyPlan record or null if the day is not confirmed.
     */
    @UseGuards(GraphqlAuthGuard)
    @Query(() => DailyPlan, { nullable: true })
    async getDailyPlan(
	    @ContextualRequest() context: CtxRequest,
	    @Args('date', { type: () => String }) date: string,
    ): Promise<DailyPlan | null> {
	  const targetDate = new Date(date);
	  return (await this.useCaseFactory.create(GetDailyPlanUseCase))
		  .handle(context, targetDate);
    }
}
