import LinkGroupResolver from "./LinkGroupResolver";
import LinkResolver from "./LinkResolver";
import LinkClickResolver from "./LinkClickResolver";
import TagResolver from "./TagResolver";
import TaskResolver from "./TaskResolver";
import NotebookResolver from "./NotebookResolver";
import NoteResolver from "./NoteResolver";
import UserResolver from "./UserResolver";
import InvitationResolver from "./InvitationResolver";
import SearchHistoryResolver from "./SearchHistoryResolver";
import CommentResolver from "./CommentResolver";
import { ScoreResolver } from "./ScoreResolver";
import NoteTaskResolver from "./NoteTasksResolver";
import FileResolver from "./FileResolver";
import MeetingResolver from "./MeetingResolver";

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
  LinkClickResolver,
  CommentResolver,
  ScoreResolver,
  NoteTaskResolver,
  FileResolver,
  MeetingResolver,
];