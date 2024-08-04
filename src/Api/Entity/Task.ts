import { Field, Int, ObjectType } from "@nestjs/graphql";
import User from "./User";

@ObjectType()
export class Task {
  @Field(() => Int)
  id: number;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field({ nullable: true })
  dueDate?: Date;

  @Field()
  completed: boolean;

  @Field(() => Int)
  userId: number;

  @Field(() => User)
  user: User;
}
