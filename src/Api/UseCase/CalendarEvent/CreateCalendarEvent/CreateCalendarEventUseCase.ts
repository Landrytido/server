import { Injectable } from "@nestjs/common";
import { ContextualGraphqlRequest, UseCase } from "../../../../index";
import CalendarEventRepository from "../../../Repository/CalendarEvent/CalendarEventRepository";
import { CalendarEvent } from "@prisma/client";
import { CreateCalendarEventDto } from "../../../Dto/CalendarEventDto/CreateCalendarEventDto";
import GoogleCalendarService from "../../../Services/GoogleCalendarService";
import UserGoogleAccountRepository from "../../../Repository/UserGoogleAccount/UserGoogleAccountRepository";

@Injectable()
export default class CreateCalendarEventUseCase
  implements
    UseCase<
      Promise<CalendarEvent>,
      [dto: CreateCalendarEventDto, googleEmail?: string]
    >
{
  constructor(
    private readonly calendarEventRepository: CalendarEventRepository,
    private readonly googleCalendarService: GoogleCalendarService,
    private readonly userGoogleAccountRepository: UserGoogleAccountRepository
  ) {}

  async handle(
    context: ContextualGraphqlRequest,
    dto: CreateCalendarEventDto,
    googleEmail?: string
  ): Promise<CalendarEvent> {
    console.log("Use case appelé avec email Google :", googleEmail);

    // Create the local event record
    const event = await this.calendarEventRepository.create(
      context.userId,
      dto
    );

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

    // Immediately push the new event/task to Google
    if (event.eventType === "EVENT") {
      await this.googleCalendarService.pushCalendarEvent(context.userId, event);
    } else if (event.eventType === "TASK") {
      await this.googleCalendarService.pushTask(context.userId, event);
    }
    return event;
  }
}
