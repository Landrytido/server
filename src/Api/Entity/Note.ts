import { Field, GraphQLISODateTime, Int, ObjectType } from "@nestjs/graphql";
import User from "./User";
import Notebook from "./Notebook";
import { NoteCollaboration } from "./NoteCollaboration";
import { Tag } from "./Tag";
import { ContextualGraphqlRequest } from "src";

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

  @Field(() => [Tag])
  tags: Tag[];

  context?: ContextualGraphqlRequest;
}
