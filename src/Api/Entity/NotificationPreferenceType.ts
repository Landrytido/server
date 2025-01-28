import { Field, GraphQLISODateTime, Int, ObjectType } from "@nestjs/graphql";
import { NotificationType } from "src/main";
import { ContextualGraphqlRequest } from "src";
import { NotificationPreference } from "./NotificationPreference";

@ObjectType()
export class NotificationPreferenceType {
  @Field(() => Int)
  id: number;

  @Field(() => [NotificationType])
  type: [NotificationType];

  @Field(() => NotificationPreference)
  NotificationPreferenceId: number;

  @Field(() => GraphQLISODateTime)
  createdAt: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt: Date;

  context?: ContextualGraphqlRequest;
}
