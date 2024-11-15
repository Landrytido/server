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
    @Args('firstName', { type: () => String }) firstName: string,
    @Args('lastName', { type: () => String }) lastName: string
  ): Promise<Score> {
    // Construire l'objet `createScoreDto` pour l'enregistrer
    const createScoreDto = {
      userId,
      time,
      level,
      firstName,
      lastName
    };
  
    // Enregistrer le score et retourner le résultat
    const score = await this.scoreRepository.createScore(createScoreDto);
    return score;
  }

  @Query(() => [Score])
  async topThreeScores(): Promise<Score[]> {
    return this.scoreRepository.getTopThreeScores();
  }

  @Query(() => [Score])
  async topScores(
    @Args('limit', { type: () => Int, defaultValue: 10 }) limit: number,
  ): Promise<Score[]> {
    return this.scoreRepository.getTopScores(limit);
  }
}
