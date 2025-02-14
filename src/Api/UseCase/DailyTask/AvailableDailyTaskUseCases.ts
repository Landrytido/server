import CreateDailyTaskUseCase from "./CreateDailyTask/CreateDailyTaskUseCase";
import DeleteDailyTaskUseCase from "./DeleteDailyTask/DeleteDailyTaskUseCase";
import UpdateDailyTaskUseCase from "./UpdateDailyTask/UpdateDailyTaskUseCase";
import GetDailyTasksUseCase from "./GetDailyTasks/GetDailyTasksUseCase";
import ReorderDailyTasksUseCase from "./ReorderDailyTasks/ReorderDailyTasksUseCase";
import ConfirmEndOfDayUseCase from "./ConfirmEndOfDay/ConfirmEndOfDayUseCase";
import GetDailyHistoryUseCase from "./GetDailyHistory/GetDailyHistoryUseCase";
import GetMonthlyReportUseCase from "./GetMonthlyReport/GetMonthlyReportUseCase";
import GetTasksCreatedOnUseCase from "./GetTasksCreatedOn/GetTasksCreatedOnUseCase";
import GetDailyPlanUseCase from "./GetDailyPlan/GetDailyPlanUseCase";

export type AvailableDailyTaskUseCases =
	| CreateDailyTaskUseCase
	| DeleteDailyTaskUseCase
	| UpdateDailyTaskUseCase
	| GetDailyTasksUseCase
	| ReorderDailyTasksUseCase
	| ConfirmEndOfDayUseCase
	| GetDailyHistoryUseCase
	| GetMonthlyReportUseCase
	| GetTasksCreatedOnUseCase
	| GetDailyPlanUseCase

