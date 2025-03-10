import { StartChronometerUseCase } from "./StartChronometerUseCase";
import { StopChronometerUseCase } from "./StopChronometerUseCase";
import { PauseChronometerUseCase } from "./PauseChronometerUseCase";
import { ResumeChronometerUseCase } from "./ResumeChronometerUseCase";
import { ResetChronometerUseCase } from "./ResetChronometerUseCase";
import { DeleteChronometerUseCase } from "./DeleteChronometerUseCase";
import { GetChronometerUseCase } from "./GetChronometerUseCase";
import { GetAllChronometersUseCase } from "./GetAllChronometersUseCase";
import { GetCountdownUseCase } from "./GetCountdownUseCase";
import { CheckCountdownStatusUseCase } from "./CheckCountdownStatusUseCase";
import { GetCurrentTimeUseCase } from "./GetCurrentTimeUseCase";
import { RenameChronometerUseCase } from "./RenameChronometerUseCase";
import { UpdateChronometerUseCase } from "./UpdateChronometerUseCase";

export type AvailableChronometerUseCases =
  | StartChronometerUseCase
  | StopChronometerUseCase
  | PauseChronometerUseCase
  | ResumeChronometerUseCase
  | ResetChronometerUseCase
  | DeleteChronometerUseCase
  | GetChronometerUseCase
  | GetAllChronometersUseCase
  | GetCountdownUseCase
  | CheckCountdownStatusUseCase
  | GetCurrentTimeUseCase
  | RenameChronometerUseCase
  | UpdateChronometerUseCase;
