import { Field, GraphQLISODateTime, Int, ObjectType } from "@nestjs/graphql";
import User from "./User";
import { ContextualGraphqlRequest } from "src";
import { NotificationPreferenceType } from "./NotificationPreferenceType";
import {NotificationType, TimeUnit} from "@prisma/client";

@ObjectType()
export class NotificationPreference {
  @Field(() => Int)
  id: number;

  @Field(() => User)
  user: User;

  @Field(() => Int)
  userId: number;

  @Field(() => [NotificationPreferenceType])
  types: NotificationPreferenceType[];

  @Field(() => Int)
  timeBefore: number;

  @Field(() => TimeUnit)
  timeUnit: TimeUnit;

  @Field(() => GraphQLISODateTime)
  createdAt: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt: Date;

  context?: ContextualGraphqlRequest;
}
