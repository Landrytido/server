import { Field, InputType } from "@nestjs/graphql";

@InputType()
export default class SaveTagDto {
  @Field()
  name: string;
}
