import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { ContextualGraphqlRequest, UseCase } from "src";
import CityRepository from "../../Repository/Weather/CityRepository";
import FavoriteCityDto from "../../Dto/Weather/CityDto";

@Injectable()
export default class RemoveFavoriteCityUseCase
  implements UseCase<Promise<boolean>, [FavoriteCityDto]>
{
  constructor(private readonly cityRepository: CityRepository) {}

  async handle(
    context: ContextualGraphqlRequest,
    dto: FavoriteCityDto
  ): Promise<boolean> {
    try {
      if (!context.userId) {
        throw new BadRequestException("User not authenticated");
      }

      try {
        await this.cityRepository.removeFromFavorites(
          context.userId,
          dto.cityId
        );
        return true;
      } catch (error) {
        return false;
      }
    } catch (error) {
      if (!(error instanceof BadRequestException)) {
        throw new BadRequestException({
          message: "RemoveFavoriteCityUseCaseFailed",
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
