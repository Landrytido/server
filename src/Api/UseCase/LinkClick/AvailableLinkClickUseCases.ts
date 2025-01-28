import SaveLinkClickUseCase from "./SaveLinkClick/SaveLinkClickUseCase";
import IncrementLinkClickUseCase from "./IncrementLinkClick/IncrementLinkClickUseCase";
import GetLinkClickByIdUseCase from "./GetLinkClick/GetLinkClickByIdUseCase";
import DeleteLinkClickUseCase from "./DeleteLinkClick/DeleteLinkClickUseCase";
import GetLinkClickByLinkUseCase from "./GetLinkClickByLink/GetLinkClickByLink";
import GetLinkClickByUserUseCase from "./GetLinkClickByUser/GetLinkClickByUserUseCase";
import DeleteAllLinkClicksUseCase from "./DeleteAllLinkClick/DeleteAllLinkClickUseCase";

export type AvailableLinkClickUseCases =
  | SaveLinkClickUseCase
  | IncrementLinkClickUseCase
  | GetLinkClickByIdUseCase
  | DeleteLinkClickUseCase
  | GetLinkClickByLinkUseCase
  | GetLinkClickByUserUseCase
    |DeleteAllLinkClicksUseCase;
