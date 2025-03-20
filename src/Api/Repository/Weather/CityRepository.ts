import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/Core/Datasource/Prisma";
import { Prisma } from "@prisma/client";

@Injectable()
export default class CityRepository {
  constructor(private readonly prisma: PrismaService) {}

  async searchCities(query: string, limit: number = 10) {
    const lowercaseQuery = query.toLowerCase();

    return await this.prisma.city.findMany({
      where: {
        OR: [
          { name: { contains: lowercaseQuery } },
          { country: { contains: lowercaseQuery } },
        ],
      },
      include: {
        weather: true,
      },
      take: limit,
    });
  }

  async findById(id: number) {
    return await this.prisma.city.findUnique({
      where: { id },
      include: {
        weather: true,
      },
    });
  }

  async findByCoordinates(
    latitude: number,
    longitude: number,
    margin: number = 0.01
  ) {
    return await this.prisma.city.findFirst({
      where: {
        AND: [
          { latitude: { gte: latitude - margin, lte: latitude + margin } },
          { longitude: { gte: longitude - margin, lte: longitude + margin } },
        ],
      },
      include: {
        weather: true,
      },
    });
  }

  async findFavoritesByUserId(userId: number) {
    const favorites = await this.prisma.favorite.findMany({
      where: { userId },
      include: {
        city: {
          include: {
            weather: true,
          },
        },
      },
    });

    return favorites.map((favorite) => favorite.city);
  }

  async save(
    data:
      | Prisma.CityCreateInput
      | Prisma.CityUncheckedCreateInput
      | Prisma.CityUpdateInput
      | Prisma.CityUncheckedUpdateInput
  ) {
    if (!("id" in data) || data.id === undefined) {
      const name = "name" in data ? (data.name as string) : "";
      const country = "country" in data ? (data.country as string) : "";

      const existingCity = await this.findCityByNameAndCountry(name, country);

      if (existingCity) {
        return await this.prisma.city.update({
          where: { id: existingCity.id },
          data: {
            latitude:
              "latitude" in data
                ? (data.latitude as number)
                : existingCity.latitude,
            longitude:
              "longitude" in data
                ? (data.longitude as number)
                : existingCity.longitude,
            timezone:
              "timezone" in data
                ? (data.timezone as string) || ""
                : existingCity.timezone || "",
          },
        });
      }

      return await this.prisma.city.create({
        data: data as any,
      });
    } else {
      return await this.prisma.city.update({
        where: {
          id: data.id as number,
        },
        data: data as any,
      });
    }
  }

  async addToFavorites(userId: number, cityId: number) {
    return await this.prisma.favorite.upsert({
      where: {
        userId_cityId: {
          userId,
          cityId,
        },
      },
      update: {},
      create: {
        userId,
        cityId,
      },
    });
  }

  async removeFromFavorites(userId: number, cityId: number) {
    return await this.prisma.favorite.delete({
      where: {
        userId_cityId: {
          userId,
          cityId,
        },
      },
    });
  }

  async findCityByNameAndCountry(name: string, country: string) {
    return this.prisma.city.findUnique({
      where: {
        name_country: {
          name,
          country,
        },
      },
      include: {
        weather: true,
      },
    });
  }

  async isInFavorites(userId: number, cityId: number): Promise<boolean> {
    const favorite = await this.prisma.favorite.findUnique({
      where: {
        userId_cityId: {
          userId,
          cityId,
        },
      },
    });

    return !!favorite;
  }
}
