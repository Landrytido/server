import { Field, GraphQLISODateTime, Int, ObjectType } from "@nestjs/graphql";
import User from "./User";
import Notebook from "./Notebook";
import { NoteCollaboration } from "./NoteCollaboration";

import { ContextualGraphqlRequest } from "src";
import { Label } from "./Label";

@ObjectType()
export default class Note {
  @Field(() => Int)
  id: number;

  @Field()
  title: string;

  @Field({ nullable: true })
  content?: string;

  @Field(() => GraphQLISODateTime)
  createdAt: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt: Date;

  @Field(() => Int)
  userId: number;

  @Field(() => Int, { nullable: true })
  notebookId?: number;

  @Field(() => User)
  user: User;

  @Field(() => Notebook, { nullable: true })
  notebook?: Notebook;

  @Field(() => [NoteCollaboration])
  collaborations: NoteCollaboration[];

  @Field(() => [Label])
  labels: Label[];
  
  @Field(() => Int)
  clickCounter: number;
  

  context?: ContextualGraphqlRequest;
}
