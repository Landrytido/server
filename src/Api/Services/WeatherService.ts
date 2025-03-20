import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { catchError, lastValueFrom, map } from "rxjs";
import { ForecastType } from "../Entity/Weather/Forecast";

@Injectable()
export default class WeatherApiService {
  private readonly apiKey: string;
  private readonly apiBaseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {
    this.apiKey = this.configService.get<string>("WEATHER_API_KEY");
    this.apiBaseUrl = this.configService.get<string>(
      "WEATHER_API_BASE_URL",
      "https://api.weatherapi.com/v1"
    );
  }

  async searchCities(query: string, limit: number = 10, lang: string = "fr") {
    // Utilisation de URLSearchParams pour une construction d'URL plus sécurisée
    const params = new URLSearchParams({
      key: this.apiKey,
      q: query,
      limit: limit.toString(),
      lang: lang,
    });

    const url = `${this.apiBaseUrl}/search.json?${params.toString()}`;

    const response = await lastValueFrom(
      this.httpService.get(url).pipe(
        map((response) => response.data),
        catchError((error) => {
          throw new HttpException(
            `Échec de la recherche de villes: ${error.message}`,
            HttpStatus.BAD_GATEWAY
          );
        })
      )
    );

    return response.map((item) => ({
      name: item.name,
      country: item.country,
      state: item.region,
      latitude: item.lat,
      longitude: item.lon,
    }));
  }

  async getCityByCoordinates(lat: number, lon: number, lang: string = "fr") {
    const params = new URLSearchParams({
      key: this.apiKey,
      q: `${lat},${lon}`,
      lang: lang,
    });

    const url = `${this.apiBaseUrl}/search.json?${params.toString()}`;

    const response = await lastValueFrom(
      this.httpService.get(url).pipe(
        map((response) => {
          if (response.data && response.data.length > 0) {
            return response.data[0];
          }
          throw new Error("Aucune ville trouvée aux coordonnées spécifiées");
        }),
        catchError((error) => {
          throw new HttpException(
            `Échec de la récupération de la ville: ${error.message}`,
            HttpStatus.BAD_GATEWAY
          );
        })
      )
    );

    return {
      name: response.name,
      country: response.country,
      state: response.region || "",
      latitude: parseFloat(response.lat),
      longitude: parseFloat(response.lon),
    };
  }

  async getCurrentWeather(lat: number, lon: number, lang: string = "fr") {
    const params = new URLSearchParams({
      key: this.apiKey,
      q: `${lat},${lon}`,
      aqi: "no",
      lang: lang,
    });

    const url = `${this.apiBaseUrl}/current.json?${params.toString()}`;

    const response = await lastValueFrom(
      this.httpService.get(url).pipe(
        map((response) => response.data),
        catchError((error) => {
          throw new HttpException(
            `Échec de la récupération des conditions météorologiques actuelles: ${error.message}`,
            HttpStatus.BAD_GATEWAY
          );
        })
      )
    );

    const current = response.current;
    return {
      temperature: current.temp_c,
      feelsLike: current.feelslike_c,
      humidity: current.humidity,
      windSpeed: current.wind_kph,
      pressure: current.pressure_mb,
      visibility: current.vis_km * 1000, // Conversion en mètres
      description: current.condition.text,
      icon: current.condition.icon,
      tempMin: null, // Non disponible dans l'API current
      tempMax: null, // Non disponible dans l'API current
    };
  }

  async getForecast(
    lat: number,
    lon: number,
    forecastType: ForecastType,
    limit: number,
    lang: string = "fr"
  ) {
    const days = forecastType === ForecastType.DAILY ? Math.min(limit, 14) : 2; // Maximum supporté par l'API

    const params = new URLSearchParams({
      key: this.apiKey,
      q: `${lat},${lon}`,
      days: days.toString(),
      aqi: "no",
      alerts: "no",
      lang: lang,
    });

    const url = `${this.apiBaseUrl}/forecast.json?${params.toString()}`;

    const response = await lastValueFrom(
      this.httpService.get(url).pipe(
        map((response) => response.data),
        catchError((error) => {
          throw new HttpException(
            `Échec de la récupération des prévisions: ${error.message}`,
            HttpStatus.BAD_GATEWAY
          );
        })
      )
    );

    if (forecastType === ForecastType.DAILY) {
      return response.forecast.forecastday.slice(0, limit).map((day) => ({
        forecastTime: new Date(day.date),
        temperature: day.day.avgtemp_c,
        tempMin: day.day.mintemp_c,
        tempMax: day.day.maxtemp_c,
        humidity: day.day.avghumidity,
        windSpeed: day.day.maxwind_kph,
        precipProbability: day.day.daily_chance_of_rain,
        description: day.day.condition.text,
        icon: day.day.condition.icon,
        feelsLike: null, // Non disponible dans les prévisions quotidiennes
        pressure: null, // Non disponible dans les prévisions quotidiennes
        visibility: null, // Non disponible dans les prévisions quotidiennes
      }));
    } else {
      const hourlyForecasts = [];
      const now = new Date();

      for (const day of response.forecast.forecastday) {
        for (const hour of day.hour) {
          const hourTime = new Date(hour.time);
          if (hourTime > now) {
            hourlyForecasts.push({
              forecastTime: hourTime,
              temperature: hour.temp_c,
              feelsLike: hour.feelslike_c,
              humidity: hour.humidity,
              windSpeed: hour.wind_kph,
              pressure: hour.pressure_mb,
              visibility: hour.vis_km * 1000, // Conversion en mètres
              precipProbability: hour.chance_of_rain,
              description: hour.condition.text,
              icon: hour.condition.icon,
              tempMin: null, // Non disponible dans les prévisions horaires
              tempMax: null, // Non disponible dans les prévisions horaires
            });
          }
        }
      }

      return hourlyForecasts
        .sort((a, b) => a.forecastTime.getTime() - b.forecastTime.getTime())
        .slice(0, limit);
    }
  }
}
