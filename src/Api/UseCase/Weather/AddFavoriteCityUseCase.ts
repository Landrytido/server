import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { ContextualGraphqlRequest, UseCase } from "src";
import CityRepository from "../../Repository/Weather/CityRepository";
import FavoriteCityDto from "../../Dto/Weather/CityDto";
import City from "../../Entity/Weather/City";

@Injectable()
export default class AddFavoriteCityUseCase
  implements UseCase<Promise<City>, [FavoriteCityDto]>
{
  constructor(private readonly cityRepository: CityRepository) {}

  async handle(
    context: ContextualGraphqlRequest,
    dto: FavoriteCityDto
  ): Promise<City> {
    try {
      if (!context.userId) {
        throw new BadRequestException("User not authenticated");
      }
      const city = await this.cityRepository.findById(dto.cityId);

      if (!city) {
        throw new NotFoundException(`City with ID ${dto.cityId} not found`);
      }
      await this.cityRepository.addToFavorites(context.userId, dto.cityId);

      return city;
    } catch (error) {
      if (
        !(error instanceof BadRequestException) &&
        !(error instanceof NotFoundException)
      ) {
        throw new BadRequestException({
          message: "AddFavoriteCityUseCaseFailed",
          originalError: {
            message: error.message,
            error: error.response || "No additional error details",
            statusCode: 500,
          },
        });
      }
      throw error;
    }
  }
}
