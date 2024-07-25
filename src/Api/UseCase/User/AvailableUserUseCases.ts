import GetLoggedUserUseCase from "./GetLoggedUser/GetLoggedUserUseCase";
import SaveUserUseCase from "./SaveUser/SaveUserUseCase";

type AvailableUserUseCases = GetLoggedUserUseCase | SaveUserUseCase;

export default AvailableUserUseCases;
