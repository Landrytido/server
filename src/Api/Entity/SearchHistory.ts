import { ObjectType, Field, Int } from '@nestjs/graphql';
import User from 'src/Api/Entity/User';

@ObjectType()
export default class SearchHistory {
  
  @Field(() => Int)
  id: number;

  @Field(() => User)
  user: User; 

  @Field(() => Int)
  userId: number;

  @Field(() => String)
  searchTerm: string;

  @Field(() => Date)
  searchDate: Date;
}