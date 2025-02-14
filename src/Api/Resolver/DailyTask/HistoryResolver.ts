// src/Resolver/DailyTask/HistoryResolver.ts
import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import UseCaseFactory from "../../UseCase/UseCaseFactory";
import {DailyTaskHistory} from "../../Entity/DailyTask/DailyTaskHistory";
import GraphqlAuthGuard from "../../../Core/Security/Guard/GraphqlAuthGuard";
import {ContextualRequest} from "../../../Core/Decorator/ContextualRequest";
import {ContextualGraphqlRequest as CtxRequest} from "../../../index";
import GetDailyHistoryUseCase from "../../UseCase/DailyTask/GetDailyHistory/GetDailyHistoryUseCase";
import {MonthlyReport} from "../../Entity/DailyTask/MonthlyReport";
import GetMonthlyReportUseCase from "../../UseCase/DailyTask/GetMonthlyReport/GetMonthlyReportUseCase";

@Resolver()
export default class HistoryResolver {
    constructor(private readonly useCaseFactory: UseCaseFactory) {}

    /**
     * Query pour récupérer l'historique des tâches d'un jour donné.
     *
     * @param context
     * @param date - La date ciblée (ex: "2025-03-15").
     * @returns Une liste de DailyTaskHistory pour cette journée.
     */
    @UseGuards(GraphqlAuthGuard)
    @Query(() => [DailyTaskHistory], { name: 'getDailyTaskHistory' })
    async getDailyTaskHistory(
	    @ContextualRequest() context: CtxRequest,
	    @Args('date', { type: () => String }) date: string,
    ): Promise<DailyTaskHistory[]> {
	  return (await this.useCaseFactory.create(GetDailyHistoryUseCase))
		  .handle(context, date);
    }

    /**
     * Query pour obtenir le reporting mensuel.
     *
     * @param year - L'année du reporting (ex: 2025).
     * @param month - Le mois du reporting (1-indexé, ex: 3 pour mars).
     * @returns Un objet MonthlyReport contenant les agrégations.
     */
    @UseGuards(GraphqlAuthGuard)
    @Query(() => MonthlyReport, { name: 'getMonthlyReport' })
    async getMonthlyReport(
	    @ContextualRequest() context: CtxRequest,
	    @Args('year', { type: () => Int }) year: number,
	    @Args('month', { type: () => Int }) month: number,
    ): Promise<MonthlyReport> {
	  return (await this.useCaseFactory.create(GetMonthlyReportUseCase))
		  .handle(context, year, month);
    }
}
