import {InputType, Field, Int} from "@nestjs/graphql";

@InputType()
export default class UpdateLinkDto {
  @Field()
  name: string;

  @Field({ nullable: true })
  url?: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => Int, { nullable: true })
  imageId?: number;
}
