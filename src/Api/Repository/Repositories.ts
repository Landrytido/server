import UserRepository from "./UserRepository";
import LinkGroupRepository from "./LinkGroupRepository";
import LinkRepository from "./LinkRepository";
import LinkClickRepository from "./LinkClickRepository";
import TagRepository from "./TagRepository";
import TaskRepository from "./TaskRepository";
import NotebookRepository from "./NotebookRepository";
import NoteRepository from "./NoteRepository";
import InvitationRepository from "./InvitationRepository";
import SearchHistoryRepository from "./SearchHistoryRepository";
import { ScoreRepository } from "./ScoreRepository";
import NoteTasksRepository  from "./NoteTasksRepository";

export const Repositories = [
  UserRepository,
  SearchHistoryRepository,
  SearchHistoryRepository,
  TagRepository,
  TaskRepository,
  NotebookRepository,
  NoteRepository,
  InvitationRepository,
  LinkGroupRepository,
  LinkRepository,
  NoteTasksRepository,
  LinkClickRepository,
  ScoreRepository
];

