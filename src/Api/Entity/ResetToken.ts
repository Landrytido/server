import { Field, Int, ObjectType } from "@nestjs/graphql";
import User from "./User";
import { ContextualGraphqlRequest } from "../../index";

@ObjectType()
export default class ResetToken {
  @Field(() => Int)
  id: number;

  @Field()
  token: string;

  @Field()
  validityEndDate: Date;

  @Field(() => Int)
  userId: number;

  @Field(() => User)
  user: User;

  context?: ContextualGraphqlRequest;
}
