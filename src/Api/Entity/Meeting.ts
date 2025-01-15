import { Field, GraphQLISODateTime, Int, ObjectType } from "@nestjs/graphql";
import User from "./User";
import { ContextualGraphqlRequest } from "src";
import { Recurrence } from "src/main";
import { NotificationCustom } from "./NotificationCustom";
import { NotificationPreference } from "./NotificationPreference";

@ObjectType()
export class Meeting {
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

  @Field(() => Recurrence, { nullable: true })
  recurrence?: Recurrence;

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

  @Field(() => Int, { nullable: true }) //a changer ça ne peut pas être un id
  notificationCustomId?: number;

  @Field(() => NotificationCustom)
  notificationCustom?: NotificationCustom;

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
