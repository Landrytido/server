import { Field, GraphQLISODateTime, Int, ObjectType } from "@nestjs/graphql";
import { NotificationType, TimeUnit } from "src/main";

@ObjectType()
export class NotificationCustom {
  @Field(() => Int)
  id: number;

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

  @Field(() => Int, { nullable: true })
  eventId: number;

  @Field(() => Int, { nullable: true })
  taskId: number;

  @Field(() => Int, { nullable: true })
  meetingId: number;

  @Field(() => Int, { nullable: true })
  preferenceId: number;
}
