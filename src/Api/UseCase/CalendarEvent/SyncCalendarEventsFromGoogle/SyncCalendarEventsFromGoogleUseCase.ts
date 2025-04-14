import { Injectable } from "@nestjs/common";
import { ContextualGraphqlRequest } from "src";
import CalendarEventRepository from "src/Api/Repository/CalendarEvent/CalendarEventRepository";
import UserGoogleAccountRepository from "src/Api/Repository/UserGoogleAccount/UserGoogleAccountRepository";
import GoogleCalendarService from "src/Api/Services/GoogleCalendarService";

@Injectable()
export default class SyncCalendarEventsFromGoogleUseCase {
  constructor(
    private readonly calendarEventRepository: CalendarEventRepository,
    private readonly googleCalendarService: GoogleCalendarService,
    private readonly userGoogleAccountRepository: UserGoogleAccountRepository
  ) {}

  async handle(
    context: ContextualGraphqlRequest,
    email?: string
  ): Promise<boolean> {
    this.googleCalendarService.setAccessToken(null);
    const userId = context.userId;

    // Si un email est spécifié, on l'utilise, sinon on utilise le compte par défaut
    let accessToken: string | null = null;

    if (email) {
      const account =
        await this.userGoogleAccountRepository.findByUserIdAndEmail(
          userId,
          email
        );
      if (account && account.accessToken) {
        accessToken = account.accessToken;
      }
    } else {
      const accounts =
        await this.userGoogleAccountRepository.findByUserId(userId);
      const defaultAccount = accounts.find((account) => account.isDefault);
      if (defaultAccount && defaultAccount.accessToken) {
        accessToken = defaultAccount.accessToken;
      }
    }

    if (!accessToken) {
      // Si aucun token n'est trouvé, utiliser l'ancien système
      await this.calendarEventRepository.syncFromGoogleCalendar(
        userId,
        this.googleCalendarService
      );
      await this.calendarEventRepository.syncFromGoogleTasks(
        userId,
        this.googleCalendarService
      );
      return true;
    }

    // Utiliser le token spécifique pour la synchronisation
    this.googleCalendarService.setAccessToken(accessToken);

    // Synchroniser les événements et les tâches
    await this.calendarEventRepository.syncFromGoogleCalendar(
      userId,
      this.googleCalendarService
    );
    await this.calendarEventRepository.syncFromGoogleTasks(
      userId,
      this.googleCalendarService
    );

    return true;
  }
}
