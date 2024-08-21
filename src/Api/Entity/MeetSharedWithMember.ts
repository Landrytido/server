
import User from "./User";
import { ContextualGraphqlRequest } from "src";
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Event } from './Event';

@ObjectType()
export default class MeetSharedWithMember {
  @Field(() => Int)
  meetId: number;

  @Field(() => Int)
  userId: number;

  @Field(() => Event)
  meet: Event;
  
  @Field(() => User)
  user: User;

  context?: ContextualGraphqlRequest;
}
