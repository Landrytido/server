import { Field, Int, ObjectType } from "@nestjs/graphql";
import User from "./User";
import Note from "./Note";
import { ContextualGraphqlRequest } from "../../index";
import {PermissionLevel} from "@prisma/client";

@ObjectType()
export class NoteCollaboration {
  @Field(() => Int)
  id: number;

  @Field(() => PermissionLevel)
  permissionLevel: PermissionLevel;

  @Field(() => Int)
  noteId: number;

  @Field(() => Int)
  userId: number;

  @Field(() => Note)
  note: Note;

  @Field(() => User)
  user: User;

  context?: ContextualGraphqlRequest;
}
