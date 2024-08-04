import { Field, Int, ObjectType } from "@nestjs/graphql";
import User from "./User";

@ObjectType()
export class Session {
  @Field(() => Int)
  id: number;

  @Field()
  token: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => Int)
  userId: number;

  @Field(() => User)
  user: User;
}
