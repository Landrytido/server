import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ScoreRepository } from '../Repository/ScoreRepository';
import { Score } from '../Entity/Score';
import { SaveScoreDto } from '../Dto/SaveScoreDto';
import { Level } from '@prisma/client';

@Resolver(() => Score)
export class ScoreResolver {
  constructor(private readonly scoreRepository: ScoreRepository) {}

  @Mutation(() => Score)
  async addScore(
    @Args('userId', { type: () => Int }) userId: number,
    @Args('time', { type: () => Int }) time: number,
    @Args('level', { type: () => Level }) level: Level,
  ): Promise<Score> {
    const createScoreDto: SaveScoreDto = { userId, time, level };
    return this.scoreRepository.createScore(createScoreDto);
  }

  // Query pour récupérer les 3 meilleurs scores
  @Query(() => [Score])
  async topThreeScores(): Promise<Score[]> {
    return this.scoreRepository.getTopThreeScores();
  }

  // Query pour récupérer les meilleurs scores avec une limite
  @Query(() => [Score])
  async topScores(@Args('limit', { type: () => Int, defaultValue: 10 }) limit: number): Promise<Score[]> {
    return this.scoreRepository.getTopScores(limit);
  }
}
