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
import {ScoreRepository} from "./ScoreRepository";
import NoteTasksRepository from "./NoteTasksRepository";
import MeetingRepository from "./MeetingRepository";
import {AutoInstructionRepository} from "./AutoInstructionRepositorty";
import {NotificationRepository} from "./NotificationRepository";
import NotificationPreferenceRepository from "./NotificationPreferenceRepository";
import DailyTaskRepository from "./DailyTask/DailyTaskRepository";
import DailyPlanRepository from "./DailyTask/DailyPlanRepository";
import DailyTaskHistoryRepository from "./DailyTask/DailyTaskHistoryRepository";

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
    ScoreRepository,
    MeetingRepository,
    NotificationRepository,
    AutoInstructionRepository,
    NotificationPreferenceRepository,
    DailyTaskRepository,
    DailyPlanRepository,
    DailyTaskHistoryRepository
];
