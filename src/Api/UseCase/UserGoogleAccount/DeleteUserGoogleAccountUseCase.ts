import { Injectable, NotFoundException, Logger } from "@nestjs/common";
import { ContextualGraphqlRequest } from "../../../index";
import UserGoogleAccountRepository from "../../Repository/UserGoogleAccount/UserGoogleAccountRepository";
import { UserGoogleAccount } from "@prisma/client";
import GoogleCalendarService from "src/Api/Services/GoogleCalendarService";

@Injectable()
export default class DeleteUserGoogleAccountUseCase {
  private readonly logger = new Logger(DeleteUserGoogleAccountUseCase.name);

  constructor(
    private readonly userGoogleAccountRepository: UserGoogleAccountRepository,
    private readonly googleCalendarService: GoogleCalendarService
  ) {}

  async handle(
    context: ContextualGraphqlRequest,
    email: string
  ): Promise<UserGoogleAccount> {
    try {
      const account =
        await this.userGoogleAccountRepository.findByUserIdAndEmail(
          context.userId,
          email
        );

      if (!account) {
        throw new NotFoundException("Compte Google non trouvé");
      }

      // Réinitialiser le token
      this.googleCalendarService.setAccessToken(null);

      return await this.userGoogleAccountRepository.delete(
        context.userId,
        email
      );
    } catch (error) {
      this.logger.error(
        `Erreur lors de la suppression du compte Google ${email}:`,
        error
      );

      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new Error(
          "Impossible de supprimer le compte Google. Veuillez réessayer."
        );
      }
    }
  }
}
