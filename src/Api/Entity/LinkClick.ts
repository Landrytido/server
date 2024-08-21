import { Field, Int, ObjectType } from "@nestjs/graphql";
import Link from "./Link";
import { ContextualGraphqlRequest } from "../../index";
import User from "./User";

@ObjectType()
export default class LinkClick {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  clicks: number;

  @Field(() => Int, { nullable: true })
  linkId?: number;

  @Field(() => Int, { nullable: true })
  userId?: number;

  @Field(() => Link, { nullable: true })
  link?: Link;

  @Field(() => User, { nullable: true })
  user?: User;

  context?: ContextualGraphqlRequest;
}
