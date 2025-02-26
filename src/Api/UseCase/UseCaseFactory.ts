import {Injectable} from "@nestjs/common";
import ServiceFactory from "../../Core/Factory/ServiceFactory";
import {AvailableUserUseCases} from "./User/AvailableUserUseCases";
import {AvailableLinkGroupUseCases} from "./LinkGroup/AvailableLinkGroupUseCases";
import {AvailableLinkUseCases} from "./Link/AvailableLinkUseCases";
import {AvailableTagUseCases} from "./Tag/AvailableTagUseCases";
import {AvailableNoteUseCases} from "./Note/AvailbaleNoteUseCases";
import {AvailableNotebookUseCases} from "./Notebook/AvailableNotebookUseCases";
import {AvailableInvitationUseCases} from "./Invitation/AvailableInvitationUseCases";
import {AvailableSearchHistoryUseCases} from "./SearchHistory/AvailableSearchHistoryUseCases";
import {AvailableCommentUseCases} from "./Comment/AvailableCommentUseCases";
import {AvailableNoteTaskUseCases} from "./NoteTasks/AvailableNoteTaskskUseCases";
import {AvailableFileUseCases} from "./File/AvailableFileUseCases";
import {
    AvailableNotificationPreferenceUseCases
} from "./Notifications/NotificationPreference/AvailableNotificationPreferenceUseCases";
import {AvailableDailyTaskUseCases} from "./DailyTask/AvailableDailyTaskUseCases";
import {AvailableCalendarEventUseCases} from "./CalendarEvent/AvailableCalendarEventUseCases";
import {
    AvailableAutoInstructionSuggestionUseCases
} from "./AutoInstructionSuggestion/AvailableAutoInstructionSuggestionUseCases";

export type UseCases =
	| AvailableUserUseCases
	| AvailableTagUseCases
	| AvailableNotebookUseCases
	| AvailableNoteUseCases
	| AvailableInvitationUseCases
	| AvailableLinkGroupUseCases
	| AvailableLinkUseCases
	| AvailableSearchHistoryUseCases
	| AvailableCommentUseCases
	| AvailableNoteTaskUseCases
	| AvailableNotificationPreferenceUseCases
	| AvailableDailyTaskUseCases
	| AvailableCalendarEventUseCases
	| AvailableAutoInstructionSuggestionUseCases
	| AvailableFileUseCases;

@Injectable()
export default class UseCaseFactory extends ServiceFactory<UseCases> {
}
