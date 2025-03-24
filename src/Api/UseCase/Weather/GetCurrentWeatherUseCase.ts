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
import { GetCurrentWeatherDto } from "../../Dto/Weather/WeatherDto";
import Weather from "../../Entity/Weather/Weather";

@Injectable()
export default class GetCurrentWeatherUseCase
  implements UseCase<Promise<Weather>, [GetCurrentWeatherDto]>
{
  private readonly logger = new Logger(GetCurrentWeatherUseCase.name);
  private readonly CACHE_MINUTES = 30;

  constructor(
    private readonly cityRepository: CityRepository,
    private readonly weatherRepository: WeatherRepository,
    private readonly weatherApiService: WeatherApiService
  ) {}

  async handle(
    context: ContextualGraphqlRequest,
    dto: GetCurrentWeatherDto
  ): Promise<Weather> {
    try {
      this.logger.log(
        `Récupération des données météo pour la ville ID: ${dto.cityId}`
      );

      const city = await this.cityRepository.findById(dto.cityId);
      if (!city) {
        throw new NotFoundException(`Ville avec ID ${dto.cityId} non trouvée`);
      }

      this.logger.log(`Ville trouvée: ${city.name}, ${city.country}`);

      const now = new Date();
      const cachedWeather =
        await this.weatherRepository.findCurrentWeatherByCityId(dto.cityId);

      if (cachedWeather && cachedWeather.expiresAt > now) {
        this.logger.log(
          `Utilisation des données météo en cache (expire: ${cachedWeather.expiresAt})`
        );
        return this.mapToEntity(cachedWeather);
      }

      this.logger.log(`Récupération de données météo fraîches depuis l'API`);
      const weatherData = await this.weatherApiService.getCurrentWeather(
        city.latitude,
        city.longitude,
        dto.lang
      );

      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + this.CACHE_MINUTES);

      if (cachedWeather) {
        this.logger.log(
          `Mise à jour des données météo existantes ID: ${cachedWeather.id}`
        );
        const updatedWeather = await this.weatherRepository.saveWeather({
          id: cachedWeather.id,
          cityId: dto.cityId,
          ...weatherData,
          expiresAt,
        });

        return this.mapToEntity(updatedWeather);
      }

      this.logger.log(`Création de nouvelles données météo pour la ville`);
      const newWeather = await this.weatherRepository.saveWeather({
        cityId: dto.cityId,
        ...weatherData,
        expiresAt,
      });

      return this.mapToEntity(newWeather);
    } catch (error) {
      this.logger.error(`Erreur: ${error.message}`, error.stack);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new BadRequestException({
        message: "Échec de la récupération des données météo actuelles",
        originalError: {
          message: error.message,
          error: error.response || "Pas de détails d'erreur supplémentaires",
          statusCode: 500,
        },
      });
    }
  }

  private mapToEntity(data: any): Weather {
    const weather = new Weather();
    return Object.assign(weather, data);
  }
}
