import { Field, Int, ObjectType } from "@nestjs/graphql";
import User from "./User";
import LinkGroup from "./LinkGroup";

import { ContextualGraphqlRequest } from "src";

@ObjectType()
export default class Link {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  url: string;

  @Field( ()=> String, { nullable: true })
  description: string;

  @Field(() => Int)
  linkGroupId: number;

  @Field(() => Int)
  userId: number;

  @Field(() => LinkGroup)
  linkGroup: LinkGroup;

  @Field(() => User)
  user: User;

  context?: ContextualGraphqlRequest;
}
