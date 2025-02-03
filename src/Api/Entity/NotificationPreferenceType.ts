import { Field, GraphQLISODateTime, Int, ObjectType } from "@nestjs/graphql";
import { NotificationType } from "src/main";
import { ContextualGraphqlRequest } from "src";
import { NotificationPreference } from "./NotificationPreference";

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
