import { Field, InputType } from "@nestjs/graphql";

@InputType()
export default class SaveNotebookDto {
  @Field()
  title: string;
}
