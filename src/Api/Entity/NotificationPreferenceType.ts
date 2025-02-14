import { Field, GraphQLISODateTime, Int, ObjectType } from "@nestjs/graphql";
import { ContextualGraphqlRequest } from "src";
import { NotificationPreference } from "./NotificationPreference";
import {NotificationType} from "@prisma/client";

@ObjectType()
export class NotificationPreferenceType {
  @Field(() => Int)
  id: number;

  @Field(() => NotificationType)
  type: NotificationType;

  @Field(() => Int)
  notificationPreferenceId: number;

  @Field(() => NotificationPreference)
  notificationPreference: NotificationPreference;

  @Field(() => GraphQLISODateTime)
  createdAt: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt: Date;

  context?: ContextualGraphqlRequest;
}
