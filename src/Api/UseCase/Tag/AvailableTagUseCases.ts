import CreateTagUseCase from "./CreateTag/CreateTagUseCase";
import GetTagUseCase from "./GetTag/GetTagUseCase";
import RemoveTagUseCase from "./RemoveTag/RemoveTagUseCase";
import UpdateTagUseCase from "./UpdateTag/UpdateTagUseCase";

export type AvailableTagUseCases = CreateTagUseCase | GetTagUseCase | RemoveTagUseCase | UpdateTagUseCase;
