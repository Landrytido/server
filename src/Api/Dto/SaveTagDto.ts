import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class SaveTagDto {
  @Field()
  name: string;
}
