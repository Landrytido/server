import { Field, Int, ObjectType } from "@nestjs/graphql";
import User from "./User";
import Note from "./Note";
import { ContextualGraphqlRequest } from "src";

@ObjectType()
export default class Notebook {
  @Field(() => Int)
  id: number;

  @Field()
  title: string;

  @Field(() => Int)
  userId: number;

  @Field(() => User)
  user?: User;

  @Field(() => [Note])
  notes?: Note[];

  context?: ContextualGraphqlRequest;
}
