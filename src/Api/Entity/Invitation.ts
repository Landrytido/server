import { Field, Int, ObjectType } from "@nestjs/graphql";
import User from "./User";
import { ContextualGraphqlRequest } from "../../index";

@ObjectType()
export default class Invitation {
  @Field(() => Int)
  id: number;

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
