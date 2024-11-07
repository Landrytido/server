import { Field, InputType, Int } from '@nestjs/graphql';
import { Level} from '@prisma/client';

// SaveScoreDto.ts
export class SaveScoreDto {
  @Field(() => Int)
  userId: number;
  
  @Field(() => Int)
  time: number;
  
  @Field(() => Level)
  level: Level;
  
}

