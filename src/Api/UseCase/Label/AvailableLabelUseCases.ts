import CreateLabelUseCase from "./createLabelUsecase";
import GetAllLabelsUseCase from "./getAllLabelsUseCase";
import GetLabelByIdUseCase from "./getLabelByIdUseCase";
import DeleteLabelUseCase from "./DeleteLabelUseCase";
import UpdateLabelUseCase from "./UpdateLabelUseCase";


export type AvailableLabelUseCases =
    | CreateLabelUseCase
    | GetAllLabelsUseCase
    | GetLabelByIdUseCase
    | DeleteLabelUseCase
    | UpdateLabelUseCase;
