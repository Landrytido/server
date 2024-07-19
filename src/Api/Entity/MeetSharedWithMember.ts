import { Field, Int, ObjectType } from "@nestjs/graphql";
import User from "./User";
import Meet from "./Meet";

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
}
