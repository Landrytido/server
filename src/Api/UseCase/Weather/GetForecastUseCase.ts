import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { ContextualGraphqlRequest, UseCase } from "src";
import CityRepository from "../../Repository/Weather/CityRepository";
import WeatherRepository from "../../Repository/Weather/WeatherRepository";
import WeatherApiService from "../../Services/WeatherService";
import GetForecastDto from "../../Dto/Weather/WeatherDto";
import Forecast, { ForecastType } from "../../Entity/Weather/Forecast";

@Injectable()
export default class GetForecastUseCase
  implements UseCase<Promise<Forecast[]>, [GetForecastDto]>
{
  private readonly logger = new Logger(GetForecastUseCase.name);
  private readonly CACHE_HOURS = 1;

  constructor(
    private readonly cityRepository: CityRepository,
    private readonly weatherRepository: WeatherRepository,
    private readonly weatherApiService: WeatherApiService
  ) {}

  async handle(
    context: ContextualGraphqlRequest,
    dto: GetForecastDto
  ): Promise<Forecast[]> {
    try {
      const city = await this.cityRepository.findById(dto.cityId);
      if (!city) {
        throw new NotFoundException(`Ville avec ID ${dto.cityId} non trouvée`);
      }

      const defaultLimit = dto.forecastType === ForecastType.DAILY ? 7 : 24;
      const limit =
        dto.forecastType === ForecastType.DAILY
          ? dto.days || defaultLimit
          : dto.hours || defaultLimit;

      this.logger.log(
        `Récupération des prévisions ${dto.forecastType} pour ${city.name}, limite: ${limit}`
      );

      const now = new Date();
      const cachedForecasts = await this.weatherRepository.findForecastByCityId(
        dto.cityId,
        dto.forecastType,
        limit
      );

      if (
        cachedForecasts.length >= limit &&
        cachedForecasts[0].expiresAt > now
      ) {
        this.logger.log(
          `Utilisation des prévisions en cache (${cachedForecasts.length} entrées)`
        );
        return this.mapToEntities(cachedForecasts);
      }

      this.logger.log(`Récupération de prévisions fraîches depuis l'API`);
      const apiForecasts = await this.weatherApiService.getForecast(
        city.latitude,
        city.longitude,
        dto.forecastType,
        limit,
        dto.lang
      );

      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + this.CACHE_HOURS);

      this.logger.log(`Suppression des anciennes prévisions`);
      await this.weatherRepository.deleteForecastByCityId(
        dto.cityId,
        dto.forecastType
      );

      this.logger.log(
        `Enregistrement de ${apiForecasts.length} nouvelles prévisions`
      );
      const createdForecasts = await Promise.all(
        apiForecasts.map((forecast) =>
          this.weatherRepository.saveForecast({
            cityId: dto.cityId,
            forecastTime: forecast.forecastTime,
            temperature: forecast.temperature,
            tempMin: forecast.tempMin,
            tempMax: forecast.tempMax,
            feelsLike: forecast.feelsLike,
            humidity: forecast.humidity,
            windSpeed: forecast.windSpeed,
            pressure: forecast.pressure,
            visibility: forecast.visibility,
            precipProbability: forecast.precipProbability,
            description: forecast.description,
            icon: forecast.icon,
            forecastType: dto.forecastType,
            expiresAt,
          })
        )
      );

      return this.mapToEntities(createdForecasts);
    } catch (error) {
      this.logger.error(`Erreur: ${error.message}`, error.stack);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new BadRequestException({
        message: "Échec de la récupération des prévisions météo",
        originalError: {
          message: error.message,
          error: error.response || "Pas de détails d'erreur supplémentaires",
          statusCode: 500,
        },
      });
    }
  }

  private mapToEntities(forecasts: any[]): Forecast[] {
    return forecasts.map((forecast) => {
      const typedForecast = new Forecast();
      Object.assign(typedForecast, forecast);

      typedForecast.forecastType =
        forecast.forecastType === "daily" ||
        forecast.forecastType === ForecastType.DAILY
          ? ForecastType.DAILY
          : ForecastType.HOURLY;

      return typedForecast;
    });
  }
}
