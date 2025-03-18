import {Injectable} from "@nestjs/common";
import ServiceFactory from "../../Core/Factory/ServiceFactory";
import {AvailableUserUseCases} from "./User/AvailableUserUseCases";
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
import {AvailableLinksUseCases} from "./Links/AvailableLinksUseCases";
import { AvailableLabelUseCases } from "./Label/AvailableLabelUseCases";

export type UseCases =
	| AvailableLabelUseCases
	| AvailableUserUseCases
	| AvailableNotebookUseCases
	| AvailableNoteUseCases
	| AvailableInvitationUseCases
	| AvailableSearchHistoryUseCases
	| AvailableCommentUseCases
	| AvailableNoteTaskUseCases
	| AvailableNotificationPreferenceUseCases
	| AvailableDailyTaskUseCases
	| AvailableCalendarEventUseCases
	| AvailableAutoInstructionSuggestionUseCases
	| AvailableFileUseCases
	| AvailableLinksUseCases;

@Injectable()
export default class UseCaseFactory extends ServiceFactory<UseCases> {
}
