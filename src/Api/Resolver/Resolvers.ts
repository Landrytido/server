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
import { AutoInstructionResolver } from "./AutoInstructionResolver";
import { NotificationResolver } from "./Notification/NotificationResolver";
import LinkGroupResolver from "./Link/LinkGroupResolver";
import LinkResolver from "./Link/LinkResolver";
import { GoogleCalendarResolver } from "./CalendarEvent/GoogleCalendarResolver";
import CityResolver from "./Weather/CityResolver";
import WeatherResolver from "./Weather/WeatherResolver";
import { ChronometerResolver } from "./ChronometerResolver";
import BlocNotesResolver from "./BlocNotes/BlocNotesResolver";
import { LabelResolver } from "./labelResolver";
import GoogleAccountResolver from "./GoogleAccount/GoogleAccountResolver";

export const Resolvers = [
  LabelResolver,
  UserResolver,
  SearchHistoryResolver,
  NotebookResolver,
  NoteResolver,
  InvitationResolver,
  CommentResolver,
  ScoreResolver,
  NoteTaskResolver,
  FileResolver,
  AutoInstructionResolver,
  NotificationResolver,
  NotificationPreferenceResolver,
  DailyTaskResolver,
  HistoryResolver,
  CalendarEventResolver,
  GoogleCalendarResolver,
  AutoInstructionSuggestionResolver,
  LinkGroupResolver,
  CalendarEventInvitationResolver,
  LinkResolver,
  CityResolver,
  WeatherResolver,
  ChronometerResolver,
  BlocNotesResolver,
  GoogleAccountResolver,
];
