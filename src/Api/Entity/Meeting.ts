import { Field, GraphQLISODateTime, Int, ObjectType } from "@nestjs/graphql";
import User from "./User";
import { ContextualGraphqlRequest } from "src";
import { Recurrence } from "src/main";

@ObjectType()
export class Meeting {
  @Field(() => Int)
  id: number;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field(() => GraphQLISODateTime)
  startDate: Date;

  @Field(() => GraphQLISODateTime)
  endDate: Date;

  @Field()
  isRecurring: boolean;

  @Field(() => Recurrence, { nullable: true })
  recurrence?: Recurrence;
  

  @Field()
  location: string;

  @Field(() => GraphQLISODateTime)
  createdAt: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt: Date;

  @Field(() => Int)
  userId: number;

  @Field(() => User)
  user: User;

  context?: ContextualGraphqlRequest;
}
