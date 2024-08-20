import { Field, InputType } from "@nestjs/graphql";

@InputType()
export default class SaveInvitationDto {
  @Field()
  email: string;
}
