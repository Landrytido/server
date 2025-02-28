import LinkGroupResolver from "./LinkGroupResolver";
import LinkResolver from "./LinkResolver";
import TagResolver from "./TagResolver";
import NotebookResolver from "./NotebookResolver";
import NoteResolver from "./NoteResolver";
import UserResolver from "./UserResolver";
import InvitationResolver from "./InvitationResolver";
import SearchHistoryResolver from "./SearchHistoryResolver";
import CommentResolver from "./CommentResolver";
import { ScoreResolver } from "./ScoreResolver";
import NoteTaskResolver from "./NoteTasksResolver";
import FileResolver from "./FileResolver";
import NotificationPreferenceResolver from "./NotificationPreferenceResolver";
import DailyTaskResolver from "./DailyTask/DailyTaskResolver";
import HistoryResolver from "./DailyTask/HistoryResolver";
import CalendarEventResolver from "./CalendarEvent/CalendarEventResolver";
import CalendarEventInvitationResolver from "./CalendarEventInvitation/CalendarEventInvitationResolver";
import { AutoInstructionSuggestionResolver } from "./AutoInstructionSuggestion/AutoInstructionSuggestionResolver";
import {AutoInstructionResolver} from "./AutoInstructionResolver";
import {NotificationResolver} from "./Notification/NotificationResolver";
import {GoogleCalendarResolver} from "./CalendarEvent/GoogleCalendarResolver";

export const Resolvers = [
  UserResolver,
  SearchHistoryResolver,
  TagResolver,
  NotebookResolver,
  NoteResolver,
  InvitationResolver,
  LinkGroupResolver,
  LinkResolver,
  CommentResolver,
  ScoreResolver,
  NoteTaskResolver,
  FileResolver,
  NotificationResolver,
  AutoInstructionResolver,
  NotificationPreferenceResolver,
  DailyTaskResolver,
  HistoryResolver,
  CalendarEventResolver,
  GoogleCalendarResolver,
  CalendarEventInvitationResolver,
  AutoInstructionSuggestionResolver,
];
