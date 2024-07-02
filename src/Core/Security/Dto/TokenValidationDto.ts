import { Field, InputType } from '@nestjs/graphql';

@InputType()
export default class TokenValidationDto {
  @Field(() => String)
  token: string;
}
