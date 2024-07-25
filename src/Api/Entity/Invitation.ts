import { Field, Int, ObjectType } from "@nestjs/graphql";
import User from "./User";
import { ContextualGraphqlRequest } from "src";

@ObjectType()
export default class Invitation {
  @Field(() => Int)
  idPrimary: number;

  @Field(() => Int)
  receiverId: number;

  @Field(() => Int)
  senderId: number;

  @Field(() => User)
  receiver: User;

  @Field(() => User)
  sender: User;

  context?: ContextualGraphqlRequest;
}
