import DeleteEventUseCase from "./DeleteEventUseCase";
import GetAllEventUseCase from "./GetAllEventUseCase";
import GetEventByUserIdUseCase from "./GetEventByUserIdUseCase";
import GetEventUseCase from "./GetEventUseCase";
import SaveEventUseCase from "./SaveEventUseCase";

// TODO: Remove this model after refactoring tasks, events, meetings into CalendarEvent ❌
export type AvailableEventUseCases =
  | SaveEventUseCase
  | GetEventUseCase
  | GetAllEventUseCase
  | DeleteEventUseCase
  | GetEventByUserIdUseCase;
