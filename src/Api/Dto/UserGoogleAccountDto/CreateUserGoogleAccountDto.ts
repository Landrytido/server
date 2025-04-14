import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreateUserGoogleAccountDto {
  @Field()
  email: string;

  @Field()
  accessToken: string;

  @Field({ nullable: true })
  refreshToken?: string;

  @Field({ nullable: true, defaultValue: false })
  isDefault?: boolean;
}
