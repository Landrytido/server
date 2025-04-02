import CreateNoteUseCase from "./CreateNote/CreateNoteUseCase";
import DeleteNoteUseCase from "./DeleteNote/DeleteNoteUseCase";
import GetAllNotesUseCase from "./GetAllNotes/GetAllNoteUseCase";
import GetNoteUseCase from "./GetNote/GetNoteUseCase";
import GetNotesByUserIdUseCase from "./GetNotesByUserId/GetNotesByUserIdUseCase";
import IncrementNoteClickCounterUseCase from "./IncrementNoteClickCounter/IncrementNoteClickCounterUsecase";
import UpdateNoteUseCase from "./UpdateNote/UpdateNoteUseCase";
import GetNotesByLabelUseCase from "./GetNotesByLabel/GetNotesByLabelUsecase";

export type AvailableNoteUseCases =
  | CreateNoteUseCase
  | UpdateNoteUseCase
  | DeleteNoteUseCase
  | GetNoteUseCase
  | IncrementNoteClickCounterUseCase
  | GetAllNotesUseCase
  | GetNotesByLabelUseCase
  | GetNotesByUserIdUseCase;
