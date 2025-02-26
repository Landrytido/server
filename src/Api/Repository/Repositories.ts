import UserRepository from "./UserRepository";
import LinkGroupRepository from "./LinkGroupRepository";
import LinkRepository from "./LinkRepository";
import TagRepository from "./TagRepository";
import NotebookRepository from "./NotebookRepository";
import NoteRepository from "./NoteRepository";
import InvitationRepository from "./InvitationRepository";
import SearchHistoryRepository from "./SearchHistoryRepository";
import {ScoreRepository} from "./ScoreRepository";
import NoteTasksRepository from "./NoteTasksRepository";
import {AutoInstructionRepository} from "./AutoInstructionRepositorty";
import NotificationPreferenceRepository from "./NotificationPreferenceRepository";
import DailyTaskRepository from "./DailyTask/DailyTaskRepository";
import DailyPlanRepository from "./DailyTask/DailyPlanRepository";
import DailyTaskHistoryRepository from "./DailyTask/DailyTaskHistoryRepository";
import CalendarEventRepository from "./CalendarEvent/CalendarEventRepository";
import {AutoInstructionSuggestionRepository} from "./AutoInstructionSuggestion/AutoInstructionSuggestionRepository";

export const Repositories = [
    UserRepository,
    SearchHistoryRepository,
    SearchHistoryRepository,
    TagRepository,
    NotebookRepository,
    NoteRepository,
    InvitationRepository,
    LinkGroupRepository,
    LinkRepository,
    NoteTasksRepository,
    ScoreRepository,
    AutoInstructionRepository,
    NotificationPreferenceRepository,
    DailyTaskRepository,
    DailyPlanRepository,
    DailyTaskHistoryRepository,
    CalendarEventRepository,
    AutoInstructionSuggestionRepository,
];
