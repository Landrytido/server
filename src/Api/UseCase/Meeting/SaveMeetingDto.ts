import { Field, GraphQLISODateTime, InputType, Int } from "@nestjs/graphql";

@InputType()
export default class SaveMeetingDto {
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
  isRecurring: boolean; // Ajout du champ manquant

  @Field({ nullable: true }) // Ajout de recurrence comme nullable
  recurrence?: string;

  @Field()
  location: string;

  @Field(() => Int)
  userId: number;

  @Field(() => Int, { nullable: true })
  notificationPreferenceId?: number;
}
