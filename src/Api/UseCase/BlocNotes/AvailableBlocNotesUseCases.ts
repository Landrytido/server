import UpsertBlocNoteUseCase from "./UpsertBlocNote/UpsertBlocNoteUseCase";
import GetBlocNoteByUserIdUseCase from "./GetBlocNotesByUserId/GetBlocNoteByUserIdUseCase";

export type AvailableBlocNotesUseCases =
    | GetBlocNoteByUserIdUseCase
    | UpsertBlocNoteUseCase;
