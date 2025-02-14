import { Injectable } from "@nestjs/common";
import { CalendarEvent } from "@prisma/client";
import CreateCalendarEventDto from "src/Api/Dto/CalendarEvent/CreateCalendarEventDto";
import UpdateCalendarEventDto from "src/Api/Dto/CalendarEvent/UpdateCalendarEventDto";
import { PrismaService } from "src/Core/Datasource/Prisma";

@Injectable()
export default class CalendarEventRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: number): Promise<CalendarEvent> {
    // NOTE: In the previous models, each find method includes the notificationPreference field, see if it is useful
    return this.prisma.calendarEvent.findUnique({ where: { id } });
  }

  async findByUserId(userId: number) {
    return this.prisma.calendarEvent.findMany({
      where: { userId },
      include: {
        notificationPreference: {
          select: {
            id: true,
            timeBefore: true,
            timeUnit: true,
            types: true,
          },
        },
      },
    });
  }

  async findByToken(token: string) {
    return this.prisma.calendarEvent.findUnique({
      where: { token },
      include: {
        notificationPreference: {
          select: {
            id: true,
            timeBefore: true,
            timeUnit: true,
            types: true,
          },
        },
      },
    });
  }

  /**
   * Creates a calendar event
   *
   * @param userId The ID of the user creating the event.
   * @param dto The data transfer object containing event details.
   * @returns The created CalendarEvent
   */
  async create(
    userId: number,
    dto: CreateCalendarEventDto,
  ): Promise<CalendarEvent> {
    return this.prisma.calendarEvent.create({
      data: {
        type: dto.type,
        title: dto.title,
        description: dto.description,
        startDate: dto.startDate,
        endDate: dto.endDate,
        token: dto.token,
        notificationSent: dto.notificationSent,
        completed: dto.completed,
        googleEventId: dto.googleEventId,
        isRecurring: dto.isRecurring,
        recurrence: dto.recurrence,
        location: dto.location,
        place: dto.place,
        link: dto.link,
        // WARN: Uncommenting provovoques a missing field type error (check for dto and calendar event)
        // notificationPreferenceId: dto.notificationPreferenceId,
        notificationPreference: {
          connect: { id: dto.notificationPreferenceId },
        },
        user: { connect: { id: userId } },
      },
    });
  }

  /**
   * Updates a calendar event
   *
   * @param id The ID of the calendar event updated.
   * @param dto The data transfer object containing event details.
   * @returns The created CalendarEvent
   */
  async update(
    id: number,
    dto: UpdateCalendarEventDto,
  ): Promise<CalendarEvent> {
    return this.prisma.calendarEvent.update({
      where: { id },
      data: {
        type: dto.type,
        title: dto.title,
        description: dto.description,
        startDate: dto.startDate,
        endDate: dto.endDate,
        token: dto.token,
        notificationSent: dto.notificationSent,
        completed: dto.completed,
        googleEventId: dto.googleEventId,
        isRecurring: dto.isRecurring,
        recurrence: dto.recurrence,
        location: dto.location,
        place: dto.place,
        link: dto.link,
      },
    });
  }

  async markNotificationAsSent(id: number) {
    await this.prisma.calendarEvent.update({
      where: { id },
      data: { notificationSent: true },
    });
  }

  async delete(id: number): Promise<CalendarEvent> {
    return this.prisma.calendarEvent.delete({
      where: { id },
    });
  }
}
