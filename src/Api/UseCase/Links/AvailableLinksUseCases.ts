import CreateLinkFromLinkGroupUseCase from "./Link/CreateLinkFromLinkGroupUseCase/CreateLinkFromLinkGroupUseCase";
import UpdateLinkRelationUseCase from "./LinkGroupLink/UpdateLinkRelationUseCase/UpdateLinkRelationUseCase";
import DeleteLinkFromGroupUseCase from "./Link/DeleteLinkFromGroupUseCase/DeleteLinkFromGroupUseCase";
import IncrementClickCounterUseCase from "./LinkGroupLink/IncrementClickCounterUseCase/IncrementClickCounterUseCase";
import ResetClickCounterUseCase from "./LinkGroupLink/ResetClickCounterUseCase/ResetClickCounterUseCase";
import DeleteLinkGroupUseCase from "./LinkGroup/DeleteLinkGroupUseCase/DeleteLinkGroupUseCase";
import SaveLinkGroupUseCase from "./LinkGroup/SaveLinkGroupUseCase/SaveLinkGroupUseCase";
import GetMyLinkGroupsUseCase from "./LinkGroup/GetMyLinkGroupsUseCase/GetMyLinkGroupsUseCase";
import FindHotLinksUseCase from "./LinkGroupLink/FindHotLinksUseCase/FindHotLinksUseCase";

export type AvailableLinksUseCases =
	| CreateLinkFromLinkGroupUseCase
	| UpdateLinkRelationUseCase
	| DeleteLinkFromGroupUseCase
	| IncrementClickCounterUseCase
	| ResetClickCounterUseCase
	| SaveLinkGroupUseCase
	| GetMyLinkGroupsUseCase
	| DeleteLinkGroupUseCase
	| FindHotLinksUseCase;