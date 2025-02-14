import { Field, Int, ObjectType } from "@nestjs/graphql";

import { CalendarEventType, LocationType, Recurrence } from "@prisma/client";

import { NotificationPreference } from "../NotificationPreference";

@ObjectType()
export default class CalendarEvent {
  // Mandatory fields : for both types
  @Field(() => Int)
  id: number;

  @Field(() => CalendarEventType)
  type: CalendarEventType;

  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  /**
   * If not provided, current date used
   */
  @Field({ nullable: true })
  startDate?: Date;

  /**
   * If not provided, current date used + 15 minutes
   */
  @Field({ nullable: true })
  endDate?: Date;

  @Field({ nullable: true })
  token?: string;

  @Field()
  userId: number;

  @Field(() => Int, { nullable: true })
  notificationPreferenceId?: number;

  @Field(() => NotificationPreference, { nullable: true })
  NotificationPreference?: NotificationPreference;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field({ nullable: true })
  completed?: boolean;

  @Field({ nullable: true })
  googleEventId?: string;

  @Field({ nullable: true })
  isRecurring?: boolean;

  @Field(() => Recurrence, { nullable: true })
  recurrence?: Recurrence;

  @Field(() => LocationType, { nullable: true })
  location?: LocationType;

  @Field({ nullable: true })
  place?: string;

  @Field({ nullable: true })
  link?: string;
}
