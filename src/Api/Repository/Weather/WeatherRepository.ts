import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/Core/Datasource/Prisma";
import { Prisma } from "@prisma/client";
import { ForecastType } from "../../Entity/Weather/Forecast";

@Injectable()
export default class WeatherRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findCurrentWeatherByCityId(cityId: number) {
    return await this.prisma.weather.findUnique({
      where: { cityId },
      include: {
        city: true,
      },
    });
  }

  async isWeatherExpired(cityId: number): Promise<boolean> {
    const weather = await this.prisma.weather.findUnique({
      where: { cityId },
      select: { expiresAt: true },
    });

    if (!weather) return true;

    return new Date() > weather.expiresAt;
  }

  async saveWeather(
    data:
      | Prisma.XOR<
          Prisma.WeatherCreateInput,
          Prisma.WeatherUncheckedCreateInput
        >
      | Prisma.XOR<
          Prisma.WeatherUpdateInput,
          Prisma.WeatherUncheckedUpdateInput
        >
  ) {
    const normalizedData = {
      ...data,
      tempMin: data.tempMin === undefined ? null : data.tempMin,
      tempMax: data.tempMax === undefined ? null : data.tempMax,
      feelsLike: data.feelsLike === undefined ? null : data.feelsLike,
      pressure: data.pressure === undefined ? null : data.pressure,
      visibility: data.visibility === undefined ? null : data.visibility,
    };

    if (!data.id || typeof data.id === "object") {
      return await this.prisma.weather.create({
        data: normalizedData as Prisma.XOR<
          Prisma.WeatherCreateInput,
          Prisma.WeatherUncheckedCreateInput
        >,
        include: {
          city: true,
        },
      });
    }

    return await this.prisma.weather.update({
      where: {
        id: data.id as number,
      },
      data: normalizedData as Prisma.XOR<
        Prisma.WeatherUpdateInput,
        Prisma.WeatherUncheckedUpdateInput
      >,
      include: {
        city: true,
      },
    });
  }

  async deleteWeatherByCityId(cityId: number) {
    return await this.prisma.weather.delete({
      where: { cityId },
    });
  }

  async findForecastByCityId(
    cityId: number,
    forecastType: ForecastType,
    limit: number
  ) {
    const now = new Date();

    return await this.prisma.forecast.findMany({
      where: {
        cityId,
        forecastType,
        forecastTime: { gte: now },
      },
      include: {
        city: true,
      },
      orderBy: {
        forecastTime: "asc",
      },
      take: limit,
    });
  }

  async areForecastsExpired(
    cityId: number,
    forecastType: ForecastType
  ): Promise<boolean> {
    const forecast = await this.prisma.forecast.findFirst({
      where: {
        cityId,
        forecastType,
      },
      select: { expiresAt: true },
      orderBy: { expiresAt: "asc" },
    });

    if (!forecast) return true;

    return new Date() > forecast.expiresAt;
  }

  async saveForecast(
    data:
      | Prisma.XOR<
          Prisma.ForecastCreateInput,
          Prisma.ForecastUncheckedCreateInput
        >
      | Prisma.XOR<
          Prisma.ForecastUpdateInput,
          Prisma.ForecastUncheckedUpdateInput
        >
  ) {
    const normalizedData = {
      ...data,
      tempMin: data.tempMin === undefined ? null : data.tempMin,
      tempMax: data.tempMax === undefined ? null : data.tempMax,
      feelsLike: data.feelsLike === undefined ? null : data.feelsLike,
      humidity: data.humidity === undefined ? null : data.humidity,
      windSpeed: data.windSpeed === undefined ? null : data.windSpeed,
      pressure: data.pressure === undefined ? null : data.pressure,
      visibility: data.visibility === undefined ? null : data.visibility,
      precipProbability:
        data.precipProbability === undefined ? null : data.precipProbability,
    };

    if (!data.id || typeof data.id === "object") {
      return await this.prisma.forecast.create({
        data: normalizedData as Prisma.XOR<
          Prisma.ForecastCreateInput,
          Prisma.ForecastUncheckedCreateInput
        >,
        include: {
          city: true,
        },
      });
    }

    return await this.prisma.forecast.update({
      where: {
        id: data.id as number,
      },
      data: normalizedData as Prisma.XOR<
        Prisma.ForecastUpdateInput,
        Prisma.ForecastUncheckedUpdateInput
      >,
      include: {
        city: true,
      },
    });
  }

  async deleteForecastByCityId(cityId: number, forecastType: ForecastType) {
    return await this.prisma.forecast.deleteMany({
      where: {
        cityId,
        forecastType,
      },
    });
  }

  async deleteExpiredForecasts() {
    const now = new Date();

    return await this.prisma.forecast.deleteMany({
      where: {
        OR: [{ expiresAt: { lt: now } }, { forecastTime: { lt: now } }],
      },
    });
  }
}
