import { BadRequestException, Injectable } from "@nestjs/common";
import { ContextualGraphqlRequest, UseCase } from "src";
import CityRepository from "../../Repository/Weather/CityRepository";
import WeatherApiService from "../../Services/WeatherService";
import { SearchCityDto } from "../../Dto/Weather/CityDto";
import City from "../../Entity/Weather/City";

@Injectable()
export default class SearchCitiesUseCase
  implements UseCase<Promise<City[]>, [SearchCityDto]>
{
  constructor(
    private readonly cityRepository: CityRepository,
    private readonly weatherApiService: WeatherApiService
  ) {}

  async handle(
    context: ContextualGraphqlRequest,
    dto: SearchCityDto
  ): Promise<City[]> {
    if (dto.query.includes("lat:") && dto.query.includes("lon:")) {
      const latMatch = dto.query.match(/lat:([0-9.-]+)/);
      const lonMatch = dto.query.match(/lon:([0-9.-]+)/);

      if (latMatch && latMatch[1] && lonMatch && lonMatch[1]) {
        const lat = parseFloat(latMatch[1]);
        const lon = parseFloat(lonMatch[1]);

        const city = await this.cityRepository.findByCoordinates(lat, lon);
        if (city) {
          return [city];
        } else {
          const apiCity = await this.weatherApiService.getCityByCoordinates(
            lat,
            lon
          );

          try {
            const newCity = await this.cityRepository.save({
              name: apiCity.name,
              country: apiCity.country,
              latitude: apiCity.latitude,
              longitude: apiCity.longitude,
            });

            return [newCity];
          } catch (error) {
            return [
              {
                id: 0,
                name: apiCity.name,
                country: apiCity.country,
                latitude: apiCity.latitude,
                longitude: apiCity.longitude,
                createdAt: new Date(),
                updatedAt: new Date(),
              } as City,
            ];
          }
        }
      }
    }

    try {
      if (!dto.query || dto.query.trim().length < 2) {
        throw new BadRequestException(
          "Search query must be at least 2 characters"
        );
      }

      const localCities = (await this.cityRepository.searchCities(
        dto.query,
        dto.limit
      )) as City[];

      if (localCities.length >= (dto.limit || 10)) {
        return localCities;
      }

      const apiCities = await this.weatherApiService.searchCities(
        dto.query,
        (dto.limit || 10) - localCities.length
      );

      const newCities: City[] = [];

      for (const apiCity of apiCities) {
        const existingCityByNameAndCountry =
          await this.cityRepository.findCityByNameAndCountry(
            apiCity.name,
            apiCity.country
          );

        if (existingCityByNameAndCountry) {
          newCities.push(existingCityByNameAndCountry);
          continue;
        }

        const existingCityByCoords =
          await this.cityRepository.findByCoordinates(
            apiCity.latitude,
            apiCity.longitude
          );

        if (existingCityByCoords) {
          newCities.push(existingCityByCoords);
          continue;
        }

        try {
          const newCity = await this.cityRepository.save({
            name: apiCity.name,
            country: apiCity.country,
            latitude: apiCity.latitude,
            longitude: apiCity.longitude,
          });
          newCities.push(newCity);
        } catch (saveError) {
          console.error(`SearchCitiesUseCase - Error saving city:`, saveError);
        }
      }

      const results = [...localCities];

      for (const newCity of newCities) {
        const isDuplicate = results.some((city) => city.id === newCity.id);
        if (!isDuplicate) {
          results.push(newCity);
        }
      }

      return results.slice(0, dto.limit || 10);
    } catch (error) {
      console.error("SearchCitiesUseCase - Error details:", error);
      throw new BadRequestException("SearchCitiesUseCaseFailed");
    }
  }
}
