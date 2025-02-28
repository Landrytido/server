import { Field, GraphQLISODateTime, Int, ObjectType } from "@nestjs/graphql";

import User from "../User";
import CalendarEvent from "../CalendarEvent/CalendarEvent";

@ObjectType()
export default class CalendarEventInvitation {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  senderId: number;

  @Field(() => User)
  sender?: User;

  @Field(() => String)
  receiverEmail: string;

  @Field(() => User)
  receiver?: User;

  @Field(() => Int)
  calendarEventId: number;

  @Field(() => CalendarEvent)
  calendarEvent?: CalendarEvent;

  @Field(() => String)
  status: String;

  @Field(() => GraphQLISODateTime)
  updatedAt: Date;
}
