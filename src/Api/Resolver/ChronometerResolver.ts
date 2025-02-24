import { Resolver, Query, Mutation, Args, Int } from "@nestjs/graphql";
import { ChronometerService } from "../Services/ChronometerService";
import { ChronometerDto } from "../Dto/ChronometerDto";

@Resolver(() => ChronometerDto)
export class ChronometerResolver {
  constructor(private readonly chronometerService: ChronometerService) {}

  @Mutation(() => ChronometerDto)
  startChronometer(
    @Args("userId", { type: () => Int }) userId: number,
    @Args("mode") mode: "countdown" | "stopwatch",
    @Args("duration", { nullable: true }) duration?: number
  ) {
    return this.chronometerService.start(userId, mode, duration);
  }

  @Mutation(() => ChronometerDto)
  stopChronometer(@Args("userId", { type: () => Int }) userId: number) {
    return this.chronometerService.stop(userId);
  }

  @Mutation(() => ChronometerDto)
  resetChronometer(@Args("userId", { type: () => Int }) userId: number) {
    return this.chronometerService.reset(userId);
  }

  @Query(() => ChronometerDto, { nullable: true })
  getChronometer(@Args("userId", { type: () => Int }) userId: number) {
    return this.chronometerService.getChronometer(userId);
  }
}
