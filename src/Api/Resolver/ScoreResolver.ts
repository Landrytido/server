import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ScoreRepository } from '../Repository/ScoreRepository';
import { Score } from '../Entity/Score';
import { Level } from '@prisma/client';

@Resolver(() => Score)
export class ScoreResolver {
  constructor(private readonly scoreRepository: ScoreRepository) {}

  @Mutation(() => Score)
  async addScore(
    @Args('userId', { type: () => Int }) userId: number,
    @Args('time', { type: () => Int }) time: number,
    @Args('level', { type: () => Level }) level: Level,
    @Args('firstName', { type: () => String }) firstName: string,
    @Args('lastName', { type: () => String }) lastName: string
  ): Promise<Score> {
    const createScoreDto = {
      userId,
      time,
      level,
      firstName,
      lastName,
    };
    const score = await this.scoreRepository.createScore(createScoreDto);
    return score;
  }

  @Query(() => [Score])
  async topThreeScores(): Promise<Score[]> {
    return this.scoreRepository.getTopThreeScores();
  }

  @Query(() => [Score])
  async topScores(
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 10 }) limit: number,
    @Args('level', { type: () => Level, nullable: true, defaultValue: Level.EASY }) level: Level,
  ): Promise<Score[]> {
    return this.scoreRepository.getTopScores(limit, level);
  }
  

  @Query(() => [Score])
  async userScores(
    @Args('userId', { type: () => Int }) userId: number
  ): Promise<Score[]> {
    return this.scoreRepository.getUserScores(userId);
  }
}
