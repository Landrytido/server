
import GetNoteTaskUseCase from "../NoteTasks/GetNoteTask/GetNoteTaskUseCase";
import GetNoteTaskByUserIdUseCase from "../NoteTasks/GetNoteTaskbyUserId/GetNoteTaskByUserIdUseCase";
import RemoveNoteTaskUseCase from "../NoteTasks/RemoveNoteTask/RemoveNoteTaskUseCase";
import SaveNoteTaskUseCase from "../NoteTasks/SaveNoteTask/SaveNoteTaskUseCase";
import UpdateNoteTaskUseCase from "./UpdateNoteTask/UpdateNoteTaskUseCase";

export type AvailableNoteTaskUseCases =
  | GetNoteTaskByUserIdUseCase
  | GetNoteTaskUseCase
  | RemoveNoteTaskUseCase
  | SaveNoteTaskUseCase
  | UpdateNoteTaskUseCase;
