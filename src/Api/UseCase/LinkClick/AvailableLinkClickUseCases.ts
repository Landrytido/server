import SaveLinkClickUseCase from "./SaveLinkClick/SaveLinkClickUseCase";
import IncrementLinkClickUseCase from "./IncrementLinkClick/IncrementLinkClickUseCase";
import GetLinkClickByIdUseCase from "./GetLinkClick/GetLinkClickByIdUseCase";
import DeleteLinkClickUseCase from "./DeleteLinkClick/DeleteLinkClickUseCase";
import GetLinkClickByLinkUseCase from "./GetLinkClickByLink/GetLinkClickByLink";
import GetLinkClickByUserUseCase from "./GetLinkClickByUser/GetLinkClickByUserUseCase";

export type AvailableLinkClickUseCases =
  | SaveLinkClickUseCase
  | IncrementLinkClickUseCase
  | GetLinkClickByIdUseCase
  | DeleteLinkClickUseCase
  | GetLinkClickByLinkUseCase
  | GetLinkClickByUserUseCase;
