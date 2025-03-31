import {
  Field,
  Float,
  GraphQLISODateTime,
  Int,
  ObjectType,
} from "@nestjs/graphql";
import { ContextualGraphqlRequest } from "src";
import City from "./City";

@ObjectType()
export default class Weather {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  cityId: number;

  @Field(() => City)
  city: City;

  @Field(() => Float)
  temperature: number;

  @Field(() => Float, { nullable: true })
  tempMin?: number;

  @Field(() => Float, { nullable: true })
  tempMax?: number;

  @Field(() => Float, { nullable: true })
  feelsLike?: number;

  @Field(() => Int)
  humidity: number;

  @Field(() => Float)
  windSpeed: number;

  @Field(() => Int, { nullable: true })
  pressure?: number;

  @Field(() => Int, { nullable: true })
  visibility?: number;

  @Field()
  description: string;

  @Field({ nullable: true })
  icon?: string;

  @Field(() => GraphQLISODateTime)
  expiresAt: Date;

  @Field(() => GraphQLISODateTime)
  createdAt: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt: Date;

  context?: ContextualGraphqlRequest;
}
