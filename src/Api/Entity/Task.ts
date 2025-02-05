import { Field, GraphQLISODateTime, Int, ObjectType } from "@nestjs/graphql";
import User from "./User";
import { ContextualGraphqlRequest } from "src";
import { NotificationCustom } from "./NotificationCustom";
import { NotificationPreference } from "./NotificationPreference";

@ObjectType()
export default class Task {
  @Field(() => Int)
  id: number;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field(() => GraphQLISODateTime)
  dueDate?: Date;

  @Field()
  completed: boolean;

  @Field(() => Int)
  userId: number;

  @Field(() => User)
  user: User;

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
