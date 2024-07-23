import CreateLinkGroupUseCase from "./CreateLinkGroup/CreateLinkGroupUseCase";
import GetAllLinkGroupsUseCase from "./GetAllLinkGroups/GetAllLinkGroupsUseCase";
import UpdateLinkGroupUseCase from "./UpdateLinkGroup/UpdateLinkGroupUseCase";
import GetLinkGroupByIdUseCase from "./GetLinkGroupById/GetLinkGroupByIdUseCase";
import DeleteLinkGroupUseCase from "./DeleteLinkGroup/DeleteLinkGroupUseCase";
import GetLinkGroupsByUserIdUseCase from "./GetLinkGroupByUserId/GetLinkGroupByUserIdUseCase";


export type AvailableLinkGroupUseCases = CreateLinkGroupUseCase | GetAllLinkGroupsUseCase | UpdateLinkGroupUseCase | GetLinkGroupByIdUseCase | DeleteLinkGroupUseCase | GetLinkGroupsByUserIdUseCase;