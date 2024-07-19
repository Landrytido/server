import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export default class SaveNoteDto {
  @Field()
  title: string;

  @Field({ nullable: true })
  content: string;

  @Field(() => Int, { nullable: true })
  notebookId: number;
}
