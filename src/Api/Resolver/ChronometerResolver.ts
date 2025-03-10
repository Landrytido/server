import { Resolver, Query, Mutation, Args, Int, Float } from "@nestjs/graphql";
import { UpdateChronometerDto } from "../Dto/UpdateChronometerDto";
import { ChronometerMode } from "@prisma/client";
import Chronometer from "../Entity/Chronometer";

// Import des cas d'utilisation
import { StartChronometerUseCase } from "../UseCase/Chronometer/StartChronometerUseCase";
import { StopChronometerUseCase } from "../UseCase/Chronometer//StopChronometerUseCase";
import { PauseChronometerUseCase } from "../UseCase/Chronometer/PauseChronometerUseCase";
import { ResumeChronometerUseCase } from "../UseCase/Chronometer/ResumeChronometerUseCase";
import { ResetChronometerUseCase } from "../UseCase/Chronometer/ResetChronometerUseCase";
import { DeleteChronometerUseCase } from "../UseCase/Chronometer/DeleteChronometerUseCase";
import { GetChronometerUseCase } from "../UseCase/Chronometer/GetChronometerUseCase";
import { GetAllChronometersUseCase } from "../UseCase/Chronometer/GetAllChronometersUseCase";
import { GetCountdownUseCase } from "../UseCase/Chronometer/GetCountdownUseCase";
import { CheckCountdownStatusUseCase } from "../UseCase/Chronometer/CheckCountdownStatusUseCase";
import { GetCurrentTimeUseCase } from "../UseCase/Chronometer/GetCurrentTimeUseCase";
import { RenameChronometerUseCase } from "../UseCase/Chronometer/RenameChronometerUseCase";
import { UpdateChronometerUseCase } from "../UseCase/Chronometer/UpdateChronometerUseCase";

@Resolver(() => Chronometer)
export class ChronometerResolver {
  constructor(
    private readonly startChronometerUseCase: StartChronometerUseCase,
    private readonly stopChronometerUseCase: StopChronometerUseCase,
    private readonly pauseChronometerUseCase: PauseChronometerUseCase,
    private readonly resumeChronometerUseCase: ResumeChronometerUseCase,
    private readonly resetChronometerUseCase: ResetChronometerUseCase,
    private readonly deleteChronometerUseCase: DeleteChronometerUseCase,
    private readonly getChronometerUseCase: GetChronometerUseCase,
    private readonly getAllChronometersUseCase: GetAllChronometersUseCase,
    private readonly getCountdownUseCase: GetCountdownUseCase,
    private readonly checkCountdownStatusUseCase: CheckCountdownStatusUseCase,
    private readonly getCurrentTimeUseCase: GetCurrentTimeUseCase,
    private readonly renameChronometerUseCase: RenameChronometerUseCase,
    private readonly updateChronometerUseCase: UpdateChronometerUseCase
  ) {}

  @Mutation(() => Chronometer)
  startChronometer(
    @Args("userId", { type: () => Int }) userId: number,
    @Args("name") name: string,
    @Args("mode", { type: () => ChronometerMode }) mode: ChronometerMode,
    @Args("duration", { nullable: true, type: () => Float }) duration?: number
  ) {
    return this.startChronometerUseCase.execute(userId, name, mode, duration);
  }

  @Mutation(() => Chronometer)
  stopChronometer(
    @Args("userId", { type: () => Int }) userId: number,
    @Args("id") id: string
  ) {
    return this.stopChronometerUseCase.execute(userId, id);
  }

  @Mutation(() => Chronometer)
  pauseChronometer(
    @Args("userId", { type: () => Int }) userId: number,
    @Args("id") id: string
  ) {
    return this.pauseChronometerUseCase.execute(userId, id);
  }

  @Mutation(() => Chronometer)
  resumeChronometer(
    @Args("userId", { type: () => Int }) userId: number,
    @Args("id") id: string
  ) {
    return this.resumeChronometerUseCase.execute(userId, id);
  }

  @Mutation(() => Chronometer)
  resetChronometer(
    @Args("userId", { type: () => Int }) userId: number,
    @Args("id") id: string
  ) {
    return this.resetChronometerUseCase.execute(userId, id);
  }

  @Mutation(() => Chronometer)
  deleteChronometer(
    @Args("userId", { type: () => Int }) userId: number,
    @Args("id") id: string
  ) {
    return this.deleteChronometerUseCase.execute(userId, id);
  }

  @Query(() => Chronometer, { nullable: true })
  getChronometer(
    @Args("userId", { type: () => Int }) userId: number,
    @Args("id") id: string
  ) {
    return this.getChronometerUseCase.execute(userId, id);
  }

  @Query(() => [Chronometer])
  getAllChronometers(@Args("userId", { type: () => Int }) userId: number) {
    return this.getAllChronometersUseCase.execute(userId);
  }

  @Query(() => Chronometer, { nullable: true })
  getCountdown(@Args("userId", { type: () => Int }) userId: number) {
    return this.getCountdownUseCase.execute(userId);
  }

  @Query(() => Boolean)
  isCountdownFinished(@Args("chronoId") chronoId: string) {
    return this.checkCountdownStatusUseCase.execute(chronoId);
  }

  @Query(() => Int)
  getCurrentTime(@Args("chronoId") chronoId: string) {
    return this.getCurrentTimeUseCase.execute(chronoId);
  }
  
  @Mutation(() => Chronometer)
  renameChronometer(
    @Args("userId", { type: () => Int }) userId: number,
    @Args("id") id: string,
    @Args("newName") newName: string
  ) {
    return this.renameChronometerUseCase.execute(userId, id, newName);
  }

  @Mutation(() => Chronometer)
  updateChronometer(
    @Args("userId", { type: () => Int }) userId: number,
    @Args("id") id: string,
    @Args("updateData", { type: () => UpdateChronometerDto }) updateData: UpdateChronometerDto
  ) {
    return this.updateChronometerUseCase.execute(userId, id, updateData);
  }
}