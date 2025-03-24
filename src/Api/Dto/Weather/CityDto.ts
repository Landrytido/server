import { Field, InputType, Int, Float } from "@nestjs/graphql";

@InputType()
export class SearchCityDto {
  @Field()
  query: string;

  @Field(() => Int, { nullable: true, defaultValue: 10 })
  limit?: number;

  @Field({ nullable: true, defaultValue: "fr" })
  lang?: string;
}

@InputType()
export class GetCityByIdDto {
  @Field(() => Int)
  id: number;
}

@InputType()
export class GetCityByCoordinatesDto {
  @Field(() => Float)
  latitude: number;

  @Field(() => Float)
  longitude: number;
}

@InputType()
export default class FavoriteCityDto {
  @Field(() => Int)
  cityId: number;
}
