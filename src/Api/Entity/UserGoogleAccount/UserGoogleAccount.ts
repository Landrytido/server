import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export default class UserGoogleAccount {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  userId: number;

  @Field()
  email: string;

  @Field()
  isDefault: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
