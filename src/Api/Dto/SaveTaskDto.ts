import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export default class SaveTaskDto {
  @Field(() => Int, { nullable: true })
  id?: number | null;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field({ nullable: true })
  dueDate?: Date;

  @Field()
  completed?: boolean;

  @Field(() => Int)
  userId: number;

  @Field(() => Int, { nullable: true })
  notificationPreferenceId?: number;
}
