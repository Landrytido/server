import { InputType, Field, Int } from "@nestjs/graphql";

@InputType()
export default class SaveLinkClickDto {
  @Field(() => Int)
  linkId: number;

  @Field(() => Int, { nullable: true })
  id?: number;
}
