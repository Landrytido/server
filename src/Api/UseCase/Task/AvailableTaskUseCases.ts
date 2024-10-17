import GetAllTaskUseCase from "./GetAllTask/GetAllTaskUseCase";
import GetTaskUseCase from "./GetTask/GetTaskUseCase";
import GetTaskByUserIdUseCase from "./GetTaskbyUserId/GetTaskByUserIdUseCase";
import RemoveTaskUseCase from "./RemoveTask/RemoveTaskUseCase";
import SaveTaskUseCase from "./SaveTask/SaveTaskUseCase";


export type AvailableTaskUseCases =  GetTaskByUserIdUseCase | GetTaskUseCase | RemoveTaskUseCase | GetAllTaskUseCase | SaveTaskUseCase ;
