import CreateLabelUseCase from "./createLabelUsecase";
import GetAllLabelsUseCase from "./getAllLabelsUseCase";
import GetLabelByIdUseCase from "./getLabelByIdUseCase";


export type AvailableLabelUseCases =
    | CreateLabelUseCase
    | GetAllLabelsUseCase
    | GetLabelByIdUseCase;
