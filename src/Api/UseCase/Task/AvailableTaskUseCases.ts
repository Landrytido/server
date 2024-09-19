import {CreateTaskUseCase} from "./CreateTask/CreateTaskUseCase";
import GetAllTaskUseCase from "./GetAllTask/GetAllTaskUseCase";
import GetTaskUseCase from "./GetTask/GetTaskUseCase";
import GetTaskByUserIdUseCase from "./GetTaskbyUserId/GetTaskByUserIdUseCase";
import RemoveTaskUseCase from "./RemoveTask/RemoveTaskUseCase";
import UpdateTaskUseCase from "./UpdateTask/UpdateTaskUseCase";

export type AvailableTaskUseCases =  CreateTaskUseCase | GetTaskByUserIdUseCase | GetTaskUseCase | RemoveTaskUseCase | UpdateTaskUseCase | GetAllTaskUseCase ;
