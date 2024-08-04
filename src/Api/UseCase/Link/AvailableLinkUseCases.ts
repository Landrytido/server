import CreateLinkUseCase from "./CreateLink/CreateLinkUseCase";
import GetLinkByIdUseCase from "./GetLinkById/GetLinkByIdUseCase";
import GetLinksByUserIdUseCase from "./GetLinksByUserId/GetLinksByUserIdUseCase";
import UpdateLinkUseCase from "./UpdateLink/UpdateLinkUseCase";
import DeleteLinkUseCase from "./DeleteLink/DeleteLinkUseCase";
import GetLinksByLinkGroupIdUseCase from "./GetLinksByLinkGroupId/GetLinksByLinkGroupIdUseCase";

export type AvailableLinkUseCases =
  | CreateLinkUseCase
  | GetLinkByIdUseCase
  | GetLinksByUserIdUseCase
  | UpdateLinkUseCase
  | DeleteLinkUseCase
  | GetLinksByLinkGroupIdUseCase;
