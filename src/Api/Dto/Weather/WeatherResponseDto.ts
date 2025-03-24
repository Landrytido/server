import {
  Field,
  Float,
  GraphQLISODateTime,
  Int,
  ObjectType,
} from "@nestjs/graphql";

@ObjectType()
export class WeatherResponseDto {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  cityId: number;

  @Field(() => Float)
  temperature: number;

  // Garder ces champs optionnels mais gérer leur absence dans le code
  @Field(() => Float, { nullable: true })
  tempMin?: number | null;

  @Field(() => Float, { nullable: true })
  tempMax?: number | null;

  @Field(() => Float, { nullable: true })
  feelsLike?: number | null;

  @Field(() => Int)
  humidity: number;

  @Field(() => Float)
  windSpeed: number;

  @Field(() => Int, { nullable: true })
  pressure?: number | null;

  @Field(() => Int, { nullable: true })
  visibility?: number | null;

  @Field()
  description: string;

  @Field({ nullable: true })
  icon?: string | null;

  @Field(() => GraphQLISODateTime)
  expiresAt: Date;

  @Field(() => GraphQLISODateTime)
  createdAt: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt: Date;
}
