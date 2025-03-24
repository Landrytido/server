import SearchCitiesUseCase from "./SearchCitiesUseCase";
import GetCurrentWeatherUseCase from "./GetCurrentWeatherUseCase";
import GetForecastUseCase from "./GetForecastUseCase";
import AddFavoriteCityUseCase from "./AddFavoriteCityUseCase";
import RemoveFavoriteCityUseCase from "./RemoveFavoriteCityUseCase";
import { GetFavoriteCitiesUseCase } from "./GetFavoriteCitiesUseCase";

export type AvailableWeatherUseCases =
  | SearchCitiesUseCase
  | GetCurrentWeatherUseCase
  | GetForecastUseCase
  | AddFavoriteCityUseCase
  | RemoveFavoriteCityUseCase
  | GetFavoriteCitiesUseCase;
