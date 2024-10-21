import GetAllNoteTaskUseCase from "../NoteTasks/GetAllNoteTask/GetAllNoteTaskUseCase";
import GetNoteTaskUseCase from "../NoteTasks/GetNoteTask/GetNoteTaskUseCase";
import GetNoteTaskByUserIdUseCase from "../NoteTasks/GetNoteTaskbyUserId/GetNoteTaskByUserIdUseCase";
import RemoveNoteTaskUseCase from "../NoteTasks/RemoveNoteTask/RemoveNoteTaskUseCase";
import SaveNoteTaskUseCase from "../NoteTasks/SaveNoteTask/SaveNoteTaskUseCase";

export type AvailableNoteTaskUseCases =
  | GetNoteTaskByUserIdUseCase
  | GetNoteTaskUseCase
  | RemoveNoteTaskUseCase
  | GetAllNoteTaskUseCase
  | SaveNoteTaskUseCase;
