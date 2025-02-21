import LinkGroupResolver from "./LinkGroupResolver";
import LinkResolver from "./LinkResolver";
import TagResolver from "./TagResolver";
import TaskResolver from "./TaskResolver";
import NotebookResolver from "./NotebookResolver";
import NoteResolver from "./NoteResolver";
import UserResolver from "./UserResolver";
import InvitationResolver from "./InvitationResolver";
import SearchHistoryResolver from "./SearchHistoryResolver";
import CommentResolver from "./CommentResolver";
import {ScoreResolver} from "./ScoreResolver";
import NoteTaskResolver from "./NoteTasksResolver";
import FileResolver from "./FileResolver";
import MeetingResolver from "./MeetingResolver";
import {NotificationResolver} from "./NotificationResolver";
import {DeviceResolver} from "./DeviceResolver";
import {AutoInstructionResolver} from "./AutoInstructionResolver";
import NotificationPreferenceResolver from "./NotificationPreferenceResolver";
import DailyTaskResolver from "./DailyTask/DailyTaskResolver";
import HistoryResolver from "./DailyTask/HistoryResolver";
import CalendarEventResolver from "./CalendarEvent/CalendarEventResolver";
import {GoogleCalendarResolver} from "./CalendarEvent/GoogleCalendarResolver";

export const Resolvers = [
    UserResolver,
    SearchHistoryResolver,
    TagResolver,
    TaskResolver,
    NotebookResolver,
    NoteResolver,
    InvitationResolver,
    LinkGroupResolver,
    LinkResolver,
    CommentResolver,
    ScoreResolver,
    NoteTaskResolver,
    FileResolver,
    MeetingResolver,
    NotificationResolver,
    DeviceResolver,
    AutoInstructionResolver,
    NotificationPreferenceResolver,
    DailyTaskResolver,
    HistoryResolver,
    CalendarEventResolver,
    GoogleCalendarResolver
];

