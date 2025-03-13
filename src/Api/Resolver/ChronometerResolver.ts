import { Resolver, Query, Mutation, Args, Int, Float } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { UpdateChronometerDto } from "../Dto/ChronoDto/UpdateChronometerDto";
import { ChronometerMode } from "@prisma/client";
import Chronometer from "../Entity/Chronometer";
import GraphqlAuthGuard from "../../Core/Security/Guard/GraphqlAuthGuard";
import { ContextualRequest } from "../../Core/Decorator/ContextualRequest";
import { ContextualGraphqlRequest } from "../../index";
import { StartChronometerDto } from "../Dto/ChronoDto/StartChronometerDto";
import { RenameChronometerDto } from "../Dto/ChronoDto/RenameChronometerDto";
import UseCaseFactory from "../UseCase/UseCaseFactory";

import { StartChronometerUseCase } from "../UseCase/Chronometer/StartChronometerUseCase";
import { StopChronometerUseCase } from "../UseCase/Chronometer/StopChronometerUseCase";
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
import UncontextualUseCaseFactory from "../UseCase/UncontextualUseCaseFactory";

@Resolver(() => Chronometer)
export class ChronometerResolver {
  constructor(
    private readonly serviceFactory: UseCaseFactory,
    private readonly uncontextualServiceFactory: UncontextualUseCaseFactory
  ) {}

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => Chronometer)
  async startChronometer(
    @ContextualRequest() context: ContextualGraphqlRequest,
    @Args("input") dto: StartChronometerDto
  ) {
    return (await this.serviceFactory.create(StartChronometerUseCase)).handle(
      context,
      dto
    );
  }

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => Chronometer)
  async stopChronometer(
    @ContextualRequest() context: ContextualGraphqlRequest,
    @Args("id") id: string
  ) {
    return (await this.serviceFactory.create(StopChronometerUseCase)).handle(
      context,
      id
    );
  }

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => Chronometer)
  async pauseChronometer(
    @ContextualRequest() context: ContextualGraphqlRequest,
    @Args("id") id: string
  ) {
    return (await this.serviceFactory.create(PauseChronometerUseCase)).handle(
      context,
      id
    );
  }

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => Chronometer)
  async resumeChronometer(
    @ContextualRequest() context: ContextualGraphqlRequest,
    @Args("id") id: string
  ) {
    return (await this.serviceFactory.create(ResumeChronometerUseCase)).handle(
      context,
      id
    );
  }

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => Chronometer)
  async resetChronometer(
    @ContextualRequest() context: ContextualGraphqlRequest,
    @Args("id") id: string
  ) {
    return (await this.serviceFactory.create(ResetChronometerUseCase)).handle(
      context,
      id
    );
  }

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => Chronometer)
  async deleteChronometer(
    @ContextualRequest() context: ContextualGraphqlRequest,
    @Args("id") id: string
  ) {
    return (await this.serviceFactory.create(DeleteChronometerUseCase)).handle(
      context,
      id
    );
  }

  @UseGuards(GraphqlAuthGuard)
  @Query(() => Chronometer, { nullable: true })
  async getChronometer(
    @ContextualRequest() context: ContextualGraphqlRequest,
    @Args("id") id: string
  ) {
    return (await this.serviceFactory.create(GetChronometerUseCase)).handle(
      context,
      id
    );
  }

  @UseGuards(GraphqlAuthGuard)
  @Query(() => [Chronometer])
  async getAllChronometers(
    @ContextualRequest() context: ContextualGraphqlRequest
  ) {
    return (await this.serviceFactory.create(GetAllChronometersUseCase)).handle(
      context
    );
  }

  @UseGuards(GraphqlAuthGuard)
  @Query(() => Chronometer, { nullable: true })
  async getCountdown(@ContextualRequest() context: ContextualGraphqlRequest) {
    return (await this.serviceFactory.create(GetCountdownUseCase)).handle(
      context
    );
  }

  @Query(() => Boolean)
  async isCountdownFinished(
    @ContextualRequest() context: ContextualGraphqlRequest,
    @Args("chronoId") chronoId: string
  ) {
    return (
      await this.serviceFactory.create(CheckCountdownStatusUseCase)
    ).handle(context, chronoId);
  }

  @Query(() => Int)
  async getCurrentTime(
    @ContextualRequest() context: ContextualGraphqlRequest,
    @Args("chronoId") chronoId: string
  ) {
    return (await this.serviceFactory.create(GetCurrentTimeUseCase)).handle(
      context,
      chronoId
    );
  }

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => Chronometer)
  async renameChronometer(
    @ContextualRequest() context: ContextualGraphqlRequest,
    @Args("input") dto: RenameChronometerDto
  ) {
    return (await this.serviceFactory.create(RenameChronometerUseCase)).handle(
      context,
      dto
    );
  }

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => Chronometer)
  async updateChronometer(
    @ContextualRequest() context: ContextualGraphqlRequest,
    @Args("id") id: string,
    @Args("updateData") updateData: UpdateChronometerDto
  ) {
    return (await this.serviceFactory.create(UpdateChronometerUseCase)).handle(
      context,
      id,
      updateData
    );
  }
}
