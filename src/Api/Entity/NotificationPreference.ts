import { Field, GraphQLISODateTime, Int, ObjectType } from "@nestjs/graphql";
import User from "./User";
import { NotificationType, TimeUnit } from "src/main";
import { ContextualGraphqlRequest } from "src";

@ObjectType()
export class NotificationPreference {
  @Field(() => Int)
  id: number;

  @Field(() => User)
  userId: number;

  @Field(() => NotificationType)
  type: NotificationType;

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
