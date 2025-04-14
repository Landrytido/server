import { Injectable } from "@nestjs/common";
import { ContextualGraphqlRequest, UseCase } from "../../../../index";
import CalendarEventRepository from "../../../Repository/CalendarEvent/CalendarEventRepository";
import { CalendarEvent, CalendarEventType } from "@prisma/client";
import { UpdateCalendarEventDto } from "../../../Dto/CalendarEventDto/UpdateCalendarEventDto";
import GoogleCalendarService from "../../../Services/GoogleCalendarService";
import UserGoogleAccountRepository from "../../../Repository/UserGoogleAccount/UserGoogleAccountRepository";

@Injectable()
export default class UpdateCalendarEventUseCase
  implements
    UseCase<
      Promise<CalendarEvent>,
      [id: number, dto: UpdateCalendarEventDto, googleEmail?: string]
    >
{
  constructor(
    private readonly calendarEventRepository: CalendarEventRepository,
    private readonly googleCalendarService: GoogleCalendarService,
    private readonly userGoogleAccountRepository: UserGoogleAccountRepository
  ) {}

  async handle(
    context: ContextualGraphqlRequest,
    id: number,
    dto: UpdateCalendarEventDto,
    googleEmail?: string
  ): Promise<CalendarEvent> {
    console.log("Use case appelé avec email Google :", googleEmail);

    // Fetch the previous event record
    const previousEvent = await this.calendarEventRepository.findById(id);

    if (googleEmail) {
      const account =
        await this.userGoogleAccountRepository.findByUserIdAndEmail(
          context.userId,
          googleEmail
        );

      console.log("Compte trouvé pour cet email :", !!account);
      console.log("Token d'accès présent :", !!account?.accessToken);

      if (account && account.accessToken) {
        console.log("Définition du token d'accès pour :", googleEmail);
        this.googleCalendarService.setAccessToken(account.accessToken);
      }
    }

    // Update the local event record
    const event = await this.calendarEventRepository.update(
      context.userId,
      id,
      dto
    );

    if (previousEvent.eventType !== dto.eventType) {
      if (previousEvent.eventType === CalendarEventType.EVENT) {
        await this.googleCalendarService.deleteGoogleCalendarEvent(
          context.userId,
          previousEvent
        );
      } else {
        await this.googleCalendarService.deleteGoogleTask(
          context.userId,
          previousEvent
        );
      }
    }

    // Immediately push the updated event/task to Google
    if (event.eventType === CalendarEventType.EVENT) {
      await this.googleCalendarService.updateGoogleCalendarEvent(
        context.userId,
        event
      );
    } else {
      await this.googleCalendarService.updateGoogleTask(context.userId, event);
    }
    return event;
  }
}
