import { InputType, Field, Int } from "@nestjs/graphql";

@InputType()
export class ShareNoteDto {
  @Field(() => Int)
  noteId: number;

  @Field(() => Int)
  sharedWithUserId: number;
}