import { Field, GraphQLISODateTime, InputType, Int } from "@nestjs/graphql";
// TODO: Remove this model after refactoring tasks, events, meetings into CalendarEvent ❌
@InputType()
export default class saveEventDto {
  @Field(() => Int, { nullable: true })
  id?: number | null;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field(() => GraphQLISODateTime)
  startDate: Date;

  @Field(() => GraphQLISODateTime)
  endDate: Date;

  @Field()
  location: string;

  @Field({ nullable: true })
  place?: string;

  @Field({ nullable: true })
  link?: string;

  @Field(() => Int)
  userId: number;

  @Field(() => Int, { nullable: true })
  notificationPreferenceId?: number;
}
