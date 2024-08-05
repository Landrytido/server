import { Field, Int, ObjectType } from "@nestjs/graphql";
import User from "./User";
import Meet from "./Meet";
import { ContextualGraphqlRequest } from "../../index";

@ObjectType()
export default class MeetSharedWithMember {
  @Field(() => Int)
  meetId: number;

  @Field(() => Int)
  userId: number;

  @Field(() => Meet)
  meet: Meet;

  @Field(() => User)
  user: User;

  context?: ContextualGraphqlRequest;
}
