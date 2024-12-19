// src/Core/Security/Dto/LoginWithGithubDto.ts

import { InputType, Field } from '@nestjs/graphql';

@InputType()
export default class LoginWithGithubDto {
  @Field()
  code: string;
}
