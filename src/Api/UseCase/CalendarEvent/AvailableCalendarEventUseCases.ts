import CreateCalendarEventUseCase from "./CreateCalendarEvent/CreateCalendarEventUseCase";
import DeleteCalendarEventUseCase from "./DeleteCalendarEvent/DeleteCalendarEventUseCase";
import GetAllCalendarEventsUseCase from "./GetAllCalendarEvents/GetAllCalendarEventsUseCase";
import GetCalendarEventUseCase from "./GetCalendarEvent/GetCalendarEventUseCase";
import MarkNotificationAsSentUseCase from "./MarkNotificationAsSent/MarkNotificationAsSentUseCase";
import UpdateCalendarEventUseCase from "./UpdateCalendarEvent/UpdateCalendarEventUseCase";
import GetCalendarEventsByUserIdUseCase from "./GetCalendarEventsByUserId/GetCalendarEventsByUserIdUseCase";
import GetCalendarEventByTokenUseCase from "./GetCalendarEventByToken/GetCalendarEventByTokenUseCase";
import SyncCalendarEventsFromGoogleUseCase from "./SyncCalendarEventsFromGoogle/SyncCalendarEventsFromGoogleUseCase";

export type AvailableCalendarEventUseCases =
	| CreateCalendarEventUseCase
	| DeleteCalendarEventUseCase
	| GetAllCalendarEventsUseCase
	| GetCalendarEventUseCase
	| GetCalendarEventByTokenUseCase
	| GetCalendarEventsByUserIdUseCase
	| MarkNotificationAsSentUseCase
	| UpdateCalendarEventUseCase
	| SyncCalendarEventsFromGoogleUseCase