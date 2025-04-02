import UserRepository from "./UserRepository";
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
import WeatherRepository from "./Weather/WeatherRepository";
import CityRepository from "./Weather/CityRepository";
import { ChronometerRepository } from "./ChronometerRepository";
import BlocNotesRepository from "./BlocNotes/BlocNotesRepository";
import AesCypher from "src/Core/Security/AesCypher";
import { PrismaService } from "src/Core/Datasource/Prisma";
import LabelRepository from "./LabelRepository";


export const Repositories = [
    UserRepository,
    SearchHistoryRepository,
    SearchHistoryRepository,
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
    WeatherRepository,
    CityRepository,
    ChronometerRepository,
    BlocNotesRepository,
    AesCypher,
    PrismaService,
    LabelRepository,

];