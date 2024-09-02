import UserRepository from "./UserRepository";
import LinkGroupRepository from "./LinkGroupRepository";
import LinkRepository from "./LinkRepository";
import LinkClickRepository from "./LinkClickRepository";
import TagRepository from "./TagRepository";
import TaskRepository from "./TaskRepository";
import NotebookRepository from "./NotebookRepository";
import NoteRepository from "./NoteRepository";
import InvitationRepository from "./InvitationRepository";

export const Repositories = [
  UserRepository,
  TagRepository,
  TaskRepository,
  NotebookRepository,
  NoteRepository,
  InvitationRepository,
  LinkGroupRepository,
  LinkRepository,
  LinkClickRepository,
];
