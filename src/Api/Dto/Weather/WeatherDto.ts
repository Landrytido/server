import { Field, InputType, Int } from "@nestjs/graphql";
import { ForecastType } from "../../Entity/Weather/Forecast";

@InputType()
export class GetCurrentWeatherDto {
  @Field(() => Int)
  cityId: number;

  @Field(() => String, { nullable: true, defaultValue: "fr" })
  lang?: string;
}

@InputType()
export default class GetForecastDto {
  @Field(() => Int)
  cityId: number;

  @Field(() => ForecastType)
  forecastType: ForecastType;

  @Field(() => Int, { nullable: true })
  days?: number;

  @Field(() => Int, { nullable: true })
  hours?: number;

  @Field(() => String, { nullable: true, defaultValue: "fr" })
  lang?: string;
}
