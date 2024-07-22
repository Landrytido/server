import { CreateNotebookUseCase } from "./CreateNotebook/CreateNotebookUseCase";
import { DeleteNotebookUseCase } from "./DeleteNotebook/DeleteNotebookUseCase";
import { GetAllNotebooksUseCase } from "./GetAllNotebooks/GetAllNotebooksUseCase";
import { GetNotebookUseCase } from "./GetNotebook/GetNotebookUseCase";
import { GetNotebooksByUserIdUseCase } from "./GetNotebooksByUserId/GetNotebooksByUserIdUseCase";
import { UpdateNotebookUseCase } from "./UpdateNotebook/UpdateNotebookUseCase";

export type AvailableNotebookUseCases =
  | CreateNotebookUseCase
  | GetNotebookUseCase
  | GetAllNotebooksUseCase
  | UpdateNotebookUseCase
  | DeleteNotebookUseCase
  | GetNotebooksByUserIdUseCase;
