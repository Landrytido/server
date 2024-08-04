import { InputType, Field } from "@nestjs/graphql";

@InputType()
export default class UpdateLinkDto {
  @Field()
  name: string;

  @Field({ nullable: true })
  url?: string;

  @Field({ nullable: true })
  description?: string;
}
