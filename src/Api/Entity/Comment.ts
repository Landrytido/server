import { Field, GraphQLISODateTime, Int, ObjectType } from "@nestjs/graphql";
import User from "./User";
import Note from "./Note";
import { ContextualGraphqlRequest } from "../../index";

@ObjectType()
export default class Comment {
  @Field(() => Int)
  id: number;

  @Field()
  content: string;

  @Field(() => Int)
  userId: number;

  @Field(() => Int)
  noteId: number;

  @Field(() => User)
  user: User;

  @Field(() => Note)
  note: Note;

  @Field(() => GraphQLISODateTime)
  createdAt: Date;

  context?: ContextualGraphqlRequest;
}
