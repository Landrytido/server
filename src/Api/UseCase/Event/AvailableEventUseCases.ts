import DeleteEventUseCase from "./DeleteEventUseCase";
import GetAllEventUseCase from "./GetAllEventUseCase";
import GetEventByUserIdUseCase from "./GetEventByUserIdUseCase";
import GetEventUseCase from "./GetEventUseCase";
import SaveEventUseCase from "./SaveEventUseCase";

export type AvailableEventUseCases = SaveEventUseCase | GetEventUseCase | GetAllEventUseCase | DeleteEventUseCase | GetEventByUserIdUseCase ;
