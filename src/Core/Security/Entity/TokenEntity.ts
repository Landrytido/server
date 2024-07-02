import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export default class TokenEntity {
  @Field(() => String)
  token: string;
}
