import CreateLinkUseCase from "./CreateLink/CreateLinkUseCase";
import GetLinkByIdUseCase from "./GetLinkById/GetLinkByIdUseCase";
import GetLinksByUserIdUseCase from "./GetLinksByUserId/GetLinksByUserIdUseCase";
import UpdateLinkUseCase from "./UpdateLink/UpdateLinkUseCase";
import DeleteLinkUseCase from "./DeleteLink/DeleteLinkUseCase";
import GetLinksByLinkGroupIdUseCase from "./GetLinksByLinkGroupId/GetLinksByLinkGroupIdUseCase";
import GetLinksByUserIdWithMinClicksUseCase from "./GetLinksByUserIdWithMinClicks/GetLinksByUserIdWithMinClicksUseCase";
import GetSortedLinkGroupsWithTotalClicksUseCase from "../LinkGroup/GetSortedLinkGroupsWithTotalClicks/GetSortedLinkGroupsWithTotalClicksUseCase";
import ResetUserHotlinksUseCase from "./ResetUserHotlinksUseCase/ResetUserHotlinksUseCase";
import IncrementLinkUseCase from "./IncrementLinkUseCase/IncrementLinkUseCase";
import GetHotLinksUseCase from "./GetHotLinksUseCase/GetHotLinksUseCase";

export type AvailableLinkUseCases =
  | CreateLinkUseCase
  | GetLinkByIdUseCase
  | GetLinksByUserIdUseCase
  | UpdateLinkUseCase
  | DeleteLinkUseCase
  | GetLinksByLinkGroupIdUseCase
  | GetLinksByUserIdWithMinClicksUseCase
  | GetSortedLinkGroupsWithTotalClicksUseCase
  | ResetUserHotlinksUseCase
  | IncrementLinkUseCase
  | GetHotLinksUseCase;
