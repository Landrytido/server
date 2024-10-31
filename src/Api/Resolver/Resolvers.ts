import LinkGroupResolver from "./LinkGroupResolver";
import LinkResolver from "./LinkResolver";
import LinkClickResolver from "./LinkClickResolver";

import TagResolver from "./TagResolver";
import TaskResolver from "./TaskResolver";
import NotebookResolver from "./NotebookResolver";
import NoteResolver from "./NoteResolver";
import UserResolver from "./UserResolver";
import InvitationResolver from "./InvitationResolver";
import { ScoreResolver } from "./ScoreResolver";
import SearchHistoryResolver from "./SearchHistoryResolver";

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
  ScoreResolver
];
