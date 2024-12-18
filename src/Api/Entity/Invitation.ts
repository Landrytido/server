import { Field, Int, ObjectType } from "@nestjs/graphql";
import User from "./User";

import { ContextualGraphqlRequest } from "src";

@ObjectType()
export default class Invitation {
  @Field(() => Int)
  id: number;

  @Field(() => Int, { nullable: true })
  receiverId?: number;

  @Field(() => Int)
  senderId: number;

  @Field(() => User, { nullable: true })
  receiver?: User;

  @Field(() => User)
  sender: User;

  @Field()
  isRelation: boolean;

  // Champs pour gérer les invitations externes
  @Field({ nullable: true })
  externalEmailInvitation?: string;

  @Field({ nullable: true })
  tokenForExternalInvitation?: string;

  @Field({ defaultValue: false })
  isExternal: boolean;

  context?: ContextualGraphqlRequest;
}
