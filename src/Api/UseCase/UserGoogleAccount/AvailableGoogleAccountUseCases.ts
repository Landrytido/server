import CreateUserGoogleAccountUseCase from "./CreateUserGoogleAccountUseCase";
import DeleteUserGoogleAccountUseCase from "./DeleteUserGoogleAccountUseCase";
import GetUserGoogleAccountsUseCase from "./GetUserGoogleAccountsUseCase";
import SetDefaultUserGoogleAccountUseCase from "./SetDefaultUserGoogleAccountUseCase";

export type AvailableUserGoogleAccountUseCases =
  | CreateUserGoogleAccountUseCase
  | DeleteUserGoogleAccountUseCase
  | GetUserGoogleAccountsUseCase
  | SetDefaultUserGoogleAccountUseCase;
