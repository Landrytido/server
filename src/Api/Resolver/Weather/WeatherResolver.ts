import { Resolver, Query, Args } from "@nestjs/graphql";
import { ContextualRequest } from "src/Core/Decorator/ContextualRequest";
import { ContextualGraphqlRequest } from "src";
import UseCaseFactory from "../../UseCase/UseCaseFactory";
import Weather from "../../Entity/Weather/Weather";
import Forecast, { ForecastType } from "../../Entity/Weather/Forecast";
import { GetCurrentWeatherDto } from "../../Dto/Weather/WeatherDto";
import GetForecastDto from "../../Dto/Weather/WeatherDto";
import GetCurrentWeatherUseCase from "../../UseCase/Weather/GetCurrentWeatherUseCase";
import GetForecastUseCase from "../../UseCase/Weather/GetForecastUseCase";

@Resolver(() => Weather)
export default class WeatherResolver {
  constructor(private readonly serviceFactory: UseCaseFactory) {}

  @Query(() => Weather, { name: "getCurrentWeather" })
  async getCurrentWeather(
    @ContextualRequest() context: ContextualGraphqlRequest,
    @Args("data") data: GetCurrentWeatherDto
  ) {
    try {
      const getCurrentWeatherUseCase = await this.serviceFactory.create(
        GetCurrentWeatherUseCase
      );

      return await getCurrentWeatherUseCase.handle(context, data);
    } catch (error) {
      throw new Error(
        `Erreur lors de la récupération des données météo actuelles : ${error.message}`
      );
    }
  }

  @Query(() => [Forecast], { name: "getForecast" })
  async getForecast(
    @ContextualRequest() context: ContextualGraphqlRequest,
    @Args("data") data: GetForecastDto
  ) {
    try {
      const getForecastUseCase =
        await this.serviceFactory.create(GetForecastUseCase);
      return await getForecastUseCase.handle(context, data);
    } catch (error) {
      throw new Error(
        `Erreur lors de la récupération des prévisions météo : ${error.message}`
      );
    }
  }
}
