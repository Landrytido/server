import { Field, Int, ObjectType } from "@nestjs/graphql";
import User from "./User";
import Link from "./Link";
import { ContextualGraphqlRequest } from "src";

@ObjectType()
export default class LinkGroup {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field(() => Int)
  userId: number;

  @Field(() => User)
  user: User;

  @Field(() => [Link])
  links: Link[];

  context?: ContextualGraphqlRequest;
}
