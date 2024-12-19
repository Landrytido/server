import { Field, GraphQLISODateTime, Int, ObjectType } from "@nestjs/graphql";
import User from "./User";
import { ContextualGraphqlRequest } from "src";
import { Notification } from "./Notification";

@ObjectType()
export default class Task {
  @Field(() => Int)
  id: number;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field(() => GraphQLISODateTime)
  dueDate?: Date;

  @Field()
  completed: boolean;

  @Field(() => Int)
  userId: number;

  @Field(() => User)
  user: User;

  @Field(() => [Notification], { nullable: true })
  notification?: Notification[];

  context?: ContextualGraphqlRequest;
}
