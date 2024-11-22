import { Field, InputType, Int } from '@nestjs/graphql';
import User from 'src/Api/Entity/User';
import SaveUserDto from '../UseCase/User/SaveUser/SaveUserDto';

@InputType()
export default class SearchHistoryDto {
    
  @Field(() => Int, { nullable: true })
  id?: number | null;

  @Field(() => Int)
  userId: number;

  @Field(() => String)
  searchTerm: string;

  @Field(() => Date)
  searchDate?: Date;
}