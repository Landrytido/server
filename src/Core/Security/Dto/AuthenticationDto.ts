import { Field, InputType } from '@nestjs/graphql';

@InputType()
export default class AuthenticationDto {
  @Field(() => String)
  email: string;

  @Field(() => String)
  password: string;
}
