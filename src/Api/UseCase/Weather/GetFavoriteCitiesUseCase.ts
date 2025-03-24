import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { ContextualGraphqlRequest, UseCase } from "src";
import CityRepository from "../../Repository/Weather/CityRepository";
import FavoriteCityDto from "../../Dto/Weather/CityDto";
import City from "../../Entity/Weather/City";

@Injectable()
export class AddFavoriteCityUseCase
  implements UseCase<Promise<City>, [FavoriteCityDto]>
{
  private readonly logger = new Logger(AddFavoriteCityUseCase.name);

  constructor(private readonly cityRepository: CityRepository) {}

  async handle(
    context: ContextualGraphqlRequest,
    dto: FavoriteCityDto
  ): Promise<City> {
    try {
      if (!context.userId) {
        throw new BadRequestException("Utilisateur non authentifié");
      }

      const city = await this.cityRepository.findById(dto.cityId);
      if (!city) {
        throw new NotFoundException(`Ville avec ID ${dto.cityId} non trouvée`);
      }

      this.logger.log(
        `Ajout de la ville ${city.name} aux favoris de l'utilisateur ${context.userId}`
      );
      await this.cityRepository.addToFavorites(context.userId, dto.cityId);

      return city;
    } catch (error) {
      this.logger.error(`Erreur: ${error.message}`, error.stack);

      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      throw new BadRequestException({
        message: "Échec de l'ajout aux favoris",
        originalError: {
          message: error.message,
          error: error.response || "Pas de détails d'erreur supplémentaires",
          statusCode: 500,
        },
      });
    }
  }
}

@Injectable()
export class GetFavoriteCitiesUseCase implements UseCase<Promise<City[]>, []> {
  private readonly logger = new Logger(GetFavoriteCitiesUseCase.name);

  constructor(private readonly cityRepository: CityRepository) {}

  async handle(context: ContextualGraphqlRequest): Promise<City[]> {
    try {
      if (!context.userId) {
        throw new BadRequestException("Utilisateur non authentifié");
      }

      this.logger.log(
        `Récupération des villes favorites pour l'utilisateur ${context.userId}`
      );
      return await this.cityRepository.findFavoritesByUserId(context.userId);
    } catch (error) {
      this.logger.error(`Erreur: ${error.message}`, error.stack);

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new BadRequestException({
        message: "Échec de la récupération des villes favorites",
        originalError: {
          message: error.message,
          error: error.response || "Pas de détails d'erreur supplémentaires",
          statusCode: 500,
        },
      });
    }
  }
}

@Injectable()
export class RemoveFavoriteCityUseCase
  implements UseCase<Promise<boolean>, [FavoriteCityDto]>
{
  private readonly logger = new Logger(RemoveFavoriteCityUseCase.name);

  constructor(private readonly cityRepository: CityRepository) {}

  async handle(
    context: ContextualGraphqlRequest,
    dto: FavoriteCityDto
  ): Promise<boolean> {
    try {
      if (!context.userId) {
        throw new BadRequestException("Utilisateur non authentifié");
      }

      this.logger.log(
        `Suppression de la ville ${dto.cityId} des favoris de l'utilisateur ${context.userId}`
      );

      try {
        const isInFavorites = await this.cityRepository.isInFavorites(
          context.userId,
          dto.cityId
        );

        if (!isInFavorites) {
          this.logger.log(
            `La ville n'est pas dans les favoris de l'utilisateur`
          );
          return false;
        }

        await this.cityRepository.removeFromFavorites(
          context.userId,
          dto.cityId
        );
        return true;
      } catch (error) {
        this.logger.error(`Erreur lors de la suppression: ${error.message}`);
        return false;
      }
    } catch (error) {
      this.logger.error(`Erreur: ${error.message}`, error.stack);

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new BadRequestException({
        message: "Échec de la suppression des favoris",
        originalError: {
          message: error.message,
          error: error.response || "Pas de détails d'erreur supplémentaires",
          statusCode: 500,
        },
      });
    }
  }
}
