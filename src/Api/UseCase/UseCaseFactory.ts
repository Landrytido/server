import {Injectable} from "@nestjs/common";
import ServiceFactory from "../../Core/Factory/ServiceFactory";

import {AvailableUserUseCases} from "./User/AvailableUserUseCases";
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
import {AvailableChronometerUseCases} from "./Chronometer/AvailableChronometerUseCases";
import {AvailableLinksUseCases} from "./Links/AvailableLinksUseCases";
import {
    AvailableAutoInstructionSuggestionUseCases
} from "./AutoInstructionSuggestion/AvailableAutoInstructionSuggestionUseCases";
import {AvailableBlocNotesUseCases} from "./BlocNotes/AvailableBlocNotesUseCases";
import { AvailableWeatherUseCases } from "./Weather/AvailableWeatherUseCases";

export type UseCases =
    | AvailableUserUseCases
    | AvailableTagUseCases
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
    | AvailableLinksUseCases
    | AvailableChronometerUseCases
    | AvailableBlocNotesUseCases
    | AvailableWeatherUseCases;


@Injectable()
export default class UseCaseFactory extends ServiceFactory<UseCases> {
}
