import CreateCommentUseCase from './CreateComment/CreateCommentUseCase';
import DeleteCommentUseCase from './DeleteComment/DeleteCommentUseCase';
import UpdateCommentUseCase from './UpdateComment/UpdateCommentUseCase'; // Ajoutez l'importation ici
import FindCommentByNoteIdUseCase from './FindCommentByNoteId/FindCommentByNoteIdUseCase'; 


export type AvailableCommentUseCases = 
  | CreateCommentUseCase 
  | DeleteCommentUseCase 
  | UpdateCommentUseCase
  | FindCommentByNoteIdUseCase; 
