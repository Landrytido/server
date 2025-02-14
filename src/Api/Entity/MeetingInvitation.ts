import { Field, GraphQLISODateTime, Int, ObjectType } from "@nestjs/graphql";
import User from "../Entity/User";
import { Meeting } from "../Entity/Meeting";

@ObjectType()
export default class MeetingInvitation {
  @Field(() => Int, { nullable: true })
  id?: number | null;

  @Field(() => Int)
  senderId: number;

  @Field(() => User)
  sender?: User;

  @Field(() => Int)
  receiverId: number;

  @Field(() => User)
  receiver?: User;

  @Field(() => Int)
  meetingId: number;

  @Field(() => Meeting)
  meeting?: Meeting;

  @Field(() => String)
  status: String;

  @Field(() => GraphQLISODateTime)
  updatedAt: Date;
}
