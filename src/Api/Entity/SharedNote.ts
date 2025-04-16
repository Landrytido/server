import { Field, Int, ObjectType } from "@nestjs/graphql";
import User from "./User";
import Note from "./Note";
import { ContextualGraphqlRequest } from "../../index";

@ObjectType()
export default class SharedNote {
  @Field(() => Int)
  id: number;

  @Field(() => Note)
  note: Note;

  @Field(() => User)
  sharedWith: User;

  @Field(() => User)
  sharedByUser: User;

  context?: ContextualGraphqlRequest;
}