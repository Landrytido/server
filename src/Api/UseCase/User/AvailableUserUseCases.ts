import GetLoggedUserUseCase from "./GetLoggedUser/GetLoggedUserUseCase";
import SaveUserUseCase from "./SaveUser/SaveUserUseCase";

export type AvailableUserUseCases = GetLoggedUserUseCase
    | SaveUserUseCase;
