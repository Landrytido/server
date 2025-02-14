import { Field, GraphQLISODateTime, Int, ObjectType } from "@nestjs/graphql";
import User from "./User";
import MeetSharedWithMember from "./MeetSharedWithMember";
import { ContextualGraphqlRequest } from "src";
import { NotificationCustom } from "./NotificationCustom";
import { NotificationPreference } from "./NotificationPreference";
import {Recurrence} from "@prisma/client";

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

  @Field({ nullable: true })
  place?: string;

  @Field({ nullable: true })
  link?: string;

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
  notificationPreferenceId?: number;

  @Field(() => NotificationPreference)
  notificationPreference?: NotificationPreference;

  @Field(() => String, { nullable: true })
  token?: string;

  @Field(() => Boolean, { nullable: true })
  notificationSent?: boolean;

  context?: ContextualGraphqlRequest;
}
