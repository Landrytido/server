import { Field, Int, ObjectType, registerEnumType } from "@nestjs/graphql";
import User from "./User";
import Note from "./Note";
import { PermissionLevel } from "src/main";

@ObjectType()
export default class NoteCollaboration {
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
}
