import { Field, Int, ObjectType } from "@nestjs/graphql";
import User from "./User";
import { ContextualGraphqlRequest } from "src";

@ObjectType()
export default class Invitation {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  receiverId: number;

  @Field(() => Int)
  senderId: number;

  @Field(() => User, { nullable: true })
  receiver: User;

  @Field(() => User, { nullable: true })
  sender: User;

  @Field()
  isRelation: boolean;

  context?: ContextualGraphqlRequest;
}
