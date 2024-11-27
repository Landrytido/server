import User from "./User";
import { ContextualGraphqlRequest } from "src";
import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export default class MeetSharedWithMember {
  @Field(() => Int)
  meetId: number;

  @Field(() => Int)
  userId: number;

  @Field(() => User)
  user: User;

  context?: ContextualGraphqlRequest;
}
