import { ObjectType, Field, Int, GraphQLISODateTime } from "@nestjs/graphql";
import { CalendarEventType, Recurrence } from "@prisma/client";
import User from "../User";
import { NotificationPreference } from "../NotificationPreference";

@ObjectType()
export default class CalendarEvent {
  @Field(() => Int)
  id: number;

  @Field({ nullable: true })
  googleEventId?: string;

  @Field({ defaultValue: CalendarEventType.EVENT })
  eventType: CalendarEventType;
  
  @Field({nullable: true})
  title?: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => GraphQLISODateTime, { nullable: true })
  dueDate?: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  startDate?: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  endDate?: Date;

  @Field()
  isRecurring: boolean;

  @Field(() => Recurrence, { nullable: true })
  recurrence?: Recurrence;

  @Field({ nullable: true })
  location?: string;

  @Field({ nullable: true })
  link?: string;

  @Field({ nullable: true })
  token?: string;

  @Field(() => Int)
  userId: number;

  @Field(() => User)
  user: User;

  @Field(() => Int)
  notificationPreferenceId: number;

  @Field(() => NotificationPreference)
  notificationPreference: number;

  @Field(() => Boolean, { nullable: true })
  notificationSent?: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
