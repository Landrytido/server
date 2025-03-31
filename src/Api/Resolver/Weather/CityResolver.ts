import { Resolver, Mutation, Query, Args } from "@nestjs/graphql";
import { BadRequestException, UseGuards } from "@nestjs/common";
import { ContextualRequest } from "src/Core/Decorator/ContextualRequest";
import GraphqlAuthGuard from "src/Core/Security/Guard/GraphqlAuthGuard";
import { ContextualGraphqlRequest } from "src";
import UseCaseFactory from "../../UseCase/UseCaseFactory";
import City from "../../Entity/Weather/City";
import {
  SearchCityDto,
  GetCityByIdDto,
  GetCityByCoordinatesDto,
} from "../../Dto/Weather/CityDto";
import FavoriteCityDto from "../../Dto/Weather/CityDto";
import SearchCitiesUseCase from "../../UseCase/Weather/SearchCitiesUseCase";
import AddFavoriteCityUseCase from "../../UseCase/Weather/AddFavoriteCityUseCase";
import RemoveFavoriteCityUseCase from "../../UseCase/Weather/RemoveFavoriteCityUseCase";
import { GetFavoriteCitiesUseCase } from "../../UseCase/Weather/GetFavoriteCitiesUseCase";
import { WeatherResponseDto } from "../../Dto/Weather/WeatherResponseDto";
import CityRepository from "src/Api/Repository/Weather/CityRepository";
import WeatherApiService from "src/Api/Services/WeatherService";

@Resolver(() => City)
export default class CityResolver {
  constructor(
    private readonly serviceFactory: UseCaseFactory,
    private readonly cityRepository: CityRepository,
    private readonly weatherApiService: WeatherApiService
  ) {}

  private transformCityData(city: any): City {
    if (city.weather) {
      city.weather = {
        ...city.weather,
        tempMin: city.weather.tempMin ?? 0,
        tempMax: city.weather.tempMax ?? 0,
        feelsLike: city.weather.feelsLike ?? 0,
        pressure: city.weather.pressure ?? 0,
        visibility: city.weather.visibility ?? 0,
        icon: city.weather.icon ?? "",
        id: city.weather.id ?? 0,
        cityId: city.id,
        temperature: city.weather.temperature ?? 0,
        humidity: city.weather.humidity ?? 0,
        windSpeed: city.weather.windSpeed ?? 0,
        description: city.weather.description ?? "",
        expiresAt: city.weather.expiresAt ?? new Date(),
        createdAt: city.weather.createdAt ?? new Date(),
        updatedAt: city.weather.updatedAt ?? new Date(),
      };
    }
    return city;
  }

  @Query(() => [City], { name: "searchCities" })
  async searchCities(
    @ContextualRequest() context: ContextualGraphqlRequest,
    @Args("data") data: SearchCityDto
  ) {
    try {
      const searchCitiesUseCase =
        await this.serviceFactory.create(SearchCitiesUseCase);
      const cities = await searchCitiesUseCase.handle(context, data);

      const citiesWithWeather = await this.loadWeatherForCities(
        cities,
        data.lang || "fr"
      );

      return citiesWithWeather.map((city) => this.transformCityData(city));
    } catch (error) {
      console.error("Error in CityResolver.searchCities:", error);
      throw new Error(
        `Erreur lors de la recherche de villes : ${error.message || String(error)}`
      );
    }
  }

  private async loadWeatherForCities(
    cities: City[],
    lang: string = "fr"
  ): Promise<City[]> {
    const citiesWithWeather = [...cities];

    for (let i = 0; i < citiesWithWeather.length; i++) {
      const city = citiesWithWeather[i];

      if (!city.weather || new Date() > new Date(city.weather.expiresAt)) {
        try {
          const weatherData = await this.weatherApiService.getCurrentWeather(
            city.latitude,
            city.longitude,
            lang
          );

          const weatherDto = new WeatherResponseDto();
          Object.assign(weatherDto, {
            ...weatherData,
            cityId: city.id,
            tempMin: weatherData.tempMin ?? 0,
            tempMax: weatherData.tempMax ?? 0,
            feelsLike: weatherData.feelsLike ?? 0,
            pressure: weatherData.pressure ?? 0,
            visibility: weatherData.visibility ?? 0,
            icon: weatherData.icon ?? "",
            expiresAt: new Date(Date.now() + 30 * 60 * 1000),
            createdAt: new Date(),
            updatedAt: new Date(),
          });

          citiesWithWeather[i] = {
            ...city,
            weather: weatherDto,
          };
        } catch (error) {
          console.error(
            `Erreur lors du chargement des données météo pour ${city.name}:`,
            error
          );
        }
      }
    }

    return citiesWithWeather;
  }

  @Query(() => City, { name: "getCityById" })
  async getCityById(
    @ContextualRequest() context: ContextualGraphqlRequest,
    @Args("data") data: GetCityByIdDto
  ) {
    try {
      const city = await this.cityRepository.findById(data.id);

      if (!city) {
        throw new Error(`Ville avec l'ID ${data.id} non trouvée`);
      }

      return this.transformCityData(city);
    } catch (error) {
      throw new Error(
        `Erreur lors de la récupération de la ville : ${error.message}`
      );
    }
  }

  @Query(() => City, { name: "getCityByCoordinates" })
  async getCityByCoordinates(
    @ContextualRequest() context: ContextualGraphqlRequest,
    @Args("data") data: GetCityByCoordinatesDto
  ) {
    try {
      const searchCitiesUseCase =
        await this.serviceFactory.create(SearchCitiesUseCase);
      const cities = await searchCitiesUseCase.handle(context, {
        query: `lat:${data.latitude},lon:${data.longitude}`,
        limit: 1,
      });

      if (cities.length === 0) {
        throw new Error(`Aucune ville trouvée aux coordonnées spécifiées`);
      }

      const city = cities[0];

      try {
        const weatherData = await this.weatherApiService.getCurrentWeather(
          city.latitude,
          city.longitude,
          "fr"
        );

        const weatherDto = new WeatherResponseDto();
        Object.assign(weatherDto, {
          ...weatherData,
          id: 0,
          cityId: city.id,
          tempMin: weatherData.tempMin ?? null,
          tempMax: weatherData.tempMax ?? null,
          feelsLike: weatherData.feelsLike ?? null,
          pressure: weatherData.pressure ?? null,
          visibility: weatherData.visibility ?? null,
          icon: weatherData.icon ?? null,
          expiresAt: new Date(Date.now() + 30 * 60 * 1000),
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        city.weather = weatherDto;
      } catch (weatherError) {
        console.error(
          "Erreur lors du chargement des données météo:",
          weatherError
        );
      }

      return this.transformCityData(city);
    } catch (error) {
      throw new Error(
        `Erreur lors de la récupération de la ville : ${error.message}`
      );
    }
  }

  @UseGuards(GraphqlAuthGuard)
  @Query(() => [City], { name: "getFavoriteCities" })
  async getFavoriteCities(
    @ContextualRequest() context: ContextualGraphqlRequest
  ) {
    try {
      const getFavoriteCitiesUseCase = await this.serviceFactory.create(
        GetFavoriteCitiesUseCase
      );
      const cities = await getFavoriteCitiesUseCase.handle(context);

      return cities.map((city) => this.transformCityData(city));
    } catch (error) {
      throw new Error(
        `Erreur lors de la récupération des villes favorites : ${error.message}`
      );
    }
  }

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => City, { name: "addFavoriteCity" })
  async addFavoriteCity(
    @ContextualRequest() context: ContextualGraphqlRequest,
    @Args("data") data: FavoriteCityDto
  ) {
    try {
      const addFavoriteCityUseCase = await this.serviceFactory.create(
        AddFavoriteCityUseCase
      );
      const city = await addFavoriteCityUseCase.handle(context, data);

      return this.transformCityData(city);
    } catch (error) {
      throw new Error(
        `Erreur lors de l'ajout de la ville aux favoris : ${error.message}`
      );
    }
  }

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => Boolean, { name: "removeFavoriteCity" })
  async removeFavoriteCity(
    @ContextualRequest() context: ContextualGraphqlRequest,
    @Args("data") data: FavoriteCityDto
  ) {
    try {
      const removeFavoriteCityUseCase = await this.serviceFactory.create(
        RemoveFavoriteCityUseCase
      );
      return await removeFavoriteCityUseCase.handle(context, data);
    } catch (error) {
      throw new Error(
        `Erreur lors de la suppression de la ville des favoris : ${error.message}`
      );
    }
  }
}
