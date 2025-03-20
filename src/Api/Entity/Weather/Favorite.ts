import { Field, GraphQLISODateTime, Int, ObjectType } from "@nestjs/graphql";
import { ContextualGraphqlRequest } from "src";
import User from "../User";
import City from "./City";

@ObjectType()
export default class Favorite {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  userId: number;

  @Field(() => Int)
  cityId: number;

  @Field(() => User)
  user: User;

  @Field(() => City)
  city: City;

  @Field(() => GraphQLISODateTime)
  createdAt: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt: Date;

  context?: ContextualGraphqlRequest;
}
