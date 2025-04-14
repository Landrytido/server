import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class UpdateUserGoogleAccountDto {
  @Field({ nullable: true })
  isDefault?: boolean;

  @Field({ nullable: true })
  accessToken?: string;

  @Field({ nullable: true })
  refreshToken?: string;
}
