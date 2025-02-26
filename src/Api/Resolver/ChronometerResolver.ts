import { Resolver, Query, Mutation, Args, Int, Float } from "@nestjs/graphql";
import { ChronometerService } from "../Services/ChronometerService";
import { ChronometerDto } from "../Dto/ChronometerDto";

@Resolver(() => ChronometerDto)
export class ChronometerResolver {
  constructor(private readonly chronometerService: ChronometerService) {}

  @Mutation(() => ChronometerDto)
  startChronometer(
    @Args("userId", { type: () => Int }) userId: number,
    @Args("name") name: string,
    @Args("mode") mode: "countdown" | "stopwatch",
    @Args("duration", { nullable: true, type: () => Float }) duration?: number
  ) {
    return this.chronometerService.start(userId, name, mode, duration);
  }

  @Mutation(() => ChronometerDto)
  stopChronometer(
    @Args("userId", { type: () => Int }) userId: number,
    @Args("id") id: string
  ) {
    return this.chronometerService.stop(userId, id);
  }

  @Mutation(() => ChronometerDto)
  pauseChronometer(
    @Args("userId", { type: () => Int }) userId: number,
    @Args("id") id: string
  ) {
    return this.chronometerService.pause(userId, id);
  }

  @Mutation(() => ChronometerDto)
  resumeChronometer(
    @Args("userId", { type: () => Int }) userId: number,
    @Args("id") id: string
  ) {
    return this.chronometerService.resume(userId, id);
  }

  @Mutation(() => ChronometerDto)
  resetChronometer(
    @Args("userId", { type: () => Int }) userId: number,
    @Args("id") id: string
  ) {
    return this.chronometerService.reset(userId, id);
  }

  @Mutation(() => ChronometerDto)
  deleteChronometer(
    @Args("userId", { type: () => Int }) userId: number,
    @Args("id") id: string
  ) {
    return this.chronometerService.delete(userId, id);
  }

  @Query(() => ChronometerDto, { nullable: true })
  getChronometer(
    @Args("userId", { type: () => Int }) userId: number,
    @Args("id") id: string
  ) {
    return this.chronometerService.getChronometer(userId, id);
  }

  @Query(() => [ChronometerDto])
  getAllChronometers(@Args("userId", { type: () => Int }) userId: number) {
    return this.chronometerService.getAllChronometers(userId);
  }

  @Query(() => ChronometerDto, { nullable: true })
  getCountdown(@Args("userId", { type: () => Int }) userId: number) {
    return this.chronometerService.getCountdown(userId);
  }

  @Query(() => Boolean)
  isCountdownFinished(@Args("chronoId") chronoId: string) {
    return this.chronometerService.isCountdownFinished(chronoId);
  }

  @Query(() => Int)
  getCurrentTime(@Args("chronoId") chronoId: string) {
    return this.chronometerService.getCurrentTime(chronoId);
  }
}