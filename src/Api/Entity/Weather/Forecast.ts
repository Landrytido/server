import {
  Field,
  Float,
  GraphQLISODateTime,
  Int,
  ObjectType,
  registerEnumType,
} from "@nestjs/graphql";
import { ContextualGraphqlRequest } from "src";
import City from "./City";

export enum ForecastType {
  HOURLY = "hourly",
  DAILY = "daily",
}

registerEnumType(ForecastType, {
  name: "ForecastType",
  description: "Type of forecast: hourly or daily",
});

@ObjectType()
export default class Forecast {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  cityId: number;

  @Field(() => City)
  city: City;

  @Field(() => GraphQLISODateTime)
  forecastTime: Date;

  @Field(() => Float)
  temperature: number;

  @Field(() => Float, { nullable: true })
  tempMin?: number;

  @Field(() => Float, { nullable: true })
  tempMax?: number;

  @Field(() => Float, { nullable: true })
  feelsLike?: number;

  @Field(() => Int, { nullable: true })
  humidity?: number;

  @Field(() => Float, { nullable: true })
  windSpeed?: number;

  @Field(() => Int, { nullable: true })
  pressure?: number;

  @Field(() => Int, { nullable: true })
  visibility?: number;

  @Field(() => Float, { nullable: true })
  precipProbability?: number;

  @Field()
  description: string;

  @Field({ nullable: true })
  icon?: string;

  @Field(() => ForecastType)
  forecastType: ForecastType;

  @Field(() => GraphQLISODateTime)
  expiresAt: Date;

  @Field(() => GraphQLISODateTime)
  createdAt: Date;

  context?: ContextualGraphqlRequest;
}
