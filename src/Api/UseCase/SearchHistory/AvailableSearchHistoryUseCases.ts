import GetSearchHistoryUseCase from "./GetSearchHistory/GetAllSearchHistoryByUserIdUseCase";
import SaveSearchHistoryUseCase from "./CreateSearch/CreateSearchUseCase";
import DeleteSearchHistoryUseCase from "./DeleteSearch/DeleteSearchUseCase";

export type AvailableSearchHistoryUseCases = 

GetSearchHistoryUseCase |
SaveSearchHistoryUseCase|
DeleteSearchHistoryUseCase;

