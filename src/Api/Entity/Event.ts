import { Field, GraphQLISODateTime, Int, ObjectType } from "@nestjs/graphql";
import User from "./User";
import MeetSharedWithMember from "./MeetSharedWithMember";
import { ContextualGraphqlRequest } from "src";
import { Recurrence } from "src/main";
import { NotificationCustom } from "./NotificationCustom";
import { NotificationPreference } from "./NotificationPreference";

@ObjectType()
export class Event {
  @Field(() => Int)
  id: number;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field(() => GraphQLISODateTime)
  startDate: Date;

  @Field(() => GraphQLISODateTime)
  endDate: Date;

  @Field()
  isRecurring: boolean;

  @Field(() => Recurrence)
  recurrence: Recurrence;

  @Field()
  location: string;

  @Field(() => GraphQLISODateTime)
  createdAt: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt: Date;

  @Field(() => Int)
  userId: number;

  @Field(() => User)
  user: User;

  @Field(() => [MeetSharedWithMember])
  sharedWith: MeetSharedWithMember[];

  @Field(() => Int, { nullable: true })
  notificationCustomId?: number;

  @Field(() => NotificationCustom)
  notificationCustom?: NotificationCustom;

  @Field(() => Int, { nullable: true })
  notificationPreferenceId?: number;

  @Field(() => NotificationPreference)
  notificationPreference?: NotificationPreference;

  @Field(() => Boolean, { nullable: true })
  notificationSent?: boolean;

  context?: ContextualGraphqlRequest;
}
