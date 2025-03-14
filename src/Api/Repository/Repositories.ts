import UserRepository from "./UserRepository";
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
import CalendarEventInvitationRepository from "./CalendarEventInvitation/CalendarEventInvitationRepository";
import {AutoInstructionSuggestionRepository} from "./AutoInstructionSuggestion/AutoInstructionSuggestionRepository";
import LinkGroupRepository from "./Link/LinkGroupRepository";
import LinkRepository from "./Link/LinkRepository";
import LinkGroupLinkRepository from "./Link/LinkGroupLinkRepository";
import { ChronometerRepository } from "./ChronometerRepository";

export const Repositories = [
    UserRepository,
    SearchHistoryRepository,
    SearchHistoryRepository,
    TagRepository,
    NotebookRepository,
    NoteRepository,
    InvitationRepository,
    NoteTasksRepository,
    ScoreRepository,
    AutoInstructionRepository,
    NotificationPreferenceRepository,
    DailyTaskRepository,
    DailyPlanRepository,
    DailyTaskHistoryRepository,
    CalendarEventRepository,
    AutoInstructionSuggestionRepository,
    LinkGroupRepository,
    LinkRepository,
    LinkGroupLinkRepository,
    CalendarEventInvitationRepository,
    ChronometerRepository,
];