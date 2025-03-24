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
  private readonly CACHE_THREE_MINUTES = 3 * 60 * 1000;

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
      expiresAt.setTime(expiresAt.getTime() + this.CACHE_THREE_MINUTES);

      this.logger.log(`Traitement des prévisions avec transaction`);
      const createdForecasts = await this.weatherRepository.saveForecasts(
          dto.cityId,
          apiForecasts,
          dto.forecastType,
          expiresAt
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
