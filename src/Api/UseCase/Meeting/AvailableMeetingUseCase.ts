import SaveMeetingUseCase from "./SaveMeetingUseCase";
import DeleteMeetingUseCase from "./DeleteMeetingUseCase";
import GetMeetingUseCase from "./GetMeetingUseCase";
import GetAllMeetingUseCase from "./GetAllMeetingUseCase";
import GetMeetingByUserIdUseCase from "./GetMeetingByUserIdUseCase";

// TODO: Remove this model after refactoring tasks, events, meetings into CalendarEvent ❌
export type AvailableMeetingUseCases =
  | SaveMeetingUseCase
  | DeleteMeetingUseCase
  | GetMeetingUseCase
  | GetAllMeetingUseCase
  | GetMeetingByUserIdUseCase;
