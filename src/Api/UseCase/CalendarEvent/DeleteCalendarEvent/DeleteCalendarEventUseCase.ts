import { Injectable } from "@nestjs/common";
import { ContextualGraphqlRequest, UseCase } from "../../../../index";
import CalendarEventRepository from "../../../Repository/CalendarEvent/CalendarEventRepository";
import { CalendarEvent } from "@prisma/client";
import GoogleCalendarService from "../../../Services/GoogleCalendarService";
import UserGoogleAccountRepository from "../../../Repository/UserGoogleAccount/UserGoogleAccountRepository";

@Injectable()
export default class DeleteCalendarEventUseCase
  implements UseCase<Promise<CalendarEvent>, [id: number, googleEmail?: string]>
{
  constructor(
    private readonly calendarEventRepository: CalendarEventRepository,
    private readonly googleCalendarService: GoogleCalendarService,
    private readonly userGoogleAccountRepository: UserGoogleAccountRepository
  ) {}

  async handle(
    context: ContextualGraphqlRequest,
    id: number,
    googleEmail?: string
  ): Promise<CalendarEvent> {
    // Fetch the event before deletion
    const event = await this.calendarEventRepository.findById(id);

    // Si un email spécifique est fourni, utilisez ce compte Google
    if (googleEmail) {
      const account =
        await this.userGoogleAccountRepository.findByUserIdAndEmail(
          context.userId,
          googleEmail
        );

      if (account && account.accessToken) {
        // Utilisez ce token spécifique pour la suppression
        this.googleCalendarService.setAccessToken(account.accessToken);
      }
    }

    if (event) {
      // Delete from Google if googleEventId exists, based on the type
      if (event.eventType === "EVENT") {
        await this.googleCalendarService.deleteGoogleCalendarEvent(
          context.userId,
          event
        );
      } else if (event.eventType === "TASK") {
        await this.googleCalendarService.deleteGoogleTask(
          context.userId,
          event
        );
      }
    }

    // Delete the event locally
    return this.calendarEventRepository.delete(context.userId, id);
  }
}
