import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreateOrUpdateNotebook {
  @Field()
  title: string;
}
