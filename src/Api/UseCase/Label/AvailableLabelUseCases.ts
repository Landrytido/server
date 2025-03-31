import  CreateLabelUseCase  from './CreateLabelUseCase'
import  GetAllLabelsUseCase  from './GetAllLabelsUseCase'
import  GetLabelByIdUseCase  from './GetLabelByIdUseCase'

export type AvailableLabelUseCases =
    | CreateLabelUseCase
    | GetAllLabelsUseCase
    | GetLabelByIdUseCase