import {
  Field,
  Float,
  GraphQLISODateTime,
  Int,
  ObjectType,
} from "@nestjs/graphql";
import { ContextualGraphqlRequest } from "src";
import Weather from "./Weather";
import Forecast from "./Forecast";
import Favorite from "./Favorite";
import { WeatherResponseDto } from "src/Api/Dto/Weather/WeatherResponseDto";

@ObjectType()
export default class City {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  country: string;

  @Field({ nullable: true })
  state?: string;

  @Field(() => Float)
  latitude: number;

  @Field(() => Float)
  longitude: number;

  @Field({ nullable: true })
  timezone?: string;

  @Field(() => WeatherResponseDto, { nullable: true })
  weather?: WeatherResponseDto;

  @Field(() => [Forecast], { nullable: true })
  forecasts?: Forecast[];

  @Field(() => [Favorite], { nullable: true })
  favorites?: Favorite[];

  @Field(() => GraphQLISODateTime)
  createdAt: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt: Date;

  context?: ContextualGraphqlRequest;
}
