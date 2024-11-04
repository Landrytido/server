import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ScoreRepository } from '../Repository/ScoreRepository';
import { Score } from '../Entity/Score';
import { SaveScoreDto } from '../Dto/SaveScoreDto';

@Resolver(() => Score)
export class ScoreResolver {
  constructor(private readonly scoreRepository: ScoreRepository) {}

  // Mutation pour ajouter un score
  @Mutation(() => Score)
  async addScore(
    @Args('userId', { type: () => Int }) userId: number,  // Spécifier explicitement le type Int
    @Args('time', { type: () => Int }) time: number,       // Spécifier explicitement le type Int
  ): Promise<Score> {
    const createScoreDto: SaveScoreDto = { userId, time };
    return this.scoreRepository.createScore(createScoreDto);
  }

  // Query pour récupérer les 3 meilleurs scores
  @Query(() => [Score])
  async topThreeScores(): Promise<Score[]> {
    return this.scoreRepository.getTopThreeScores();
  }

  // Query pour récupérer les 15 meilleurs scores
  @Query(() => [Score])
  async topScores(@Args('limit', { type: () => Int, defaultValue: 15 }) limit: number): Promise<Score[]> {
    return this.scoreRepository.getTopScores(limit);
  }
}
