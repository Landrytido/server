// src/Repository/CalendarEvent/CalendarEventRepository.ts
import {Injectable, NotFoundException} from "@nestjs/common";
import {PrismaService} from "../../../Core/Datasource/Prisma";
import {CreateCalendarEventDto} from "../../Dto/CalendarEventDto/CreateCalendarEventDto";
import {UpdateCalendarEventDto} from "../../Dto/CalendarEventDto/UpdateCalendarEventDto";
import {CalendarEventType, Prisma} from "@prisma/client";
import GoogleCalendarService from "../../Services/GoogleCalendarService";

export type CalendarEventWithRelations = Prisma.CalendarEventGetPayload<{
  include: { user: true; notificationPreference: true };
}>;

@Injectable()
export default class CalendarEventRepository {
  constructor(private readonly prisma: PrismaService) {}

  async find(): Promise<CalendarEventWithRelations[]> {
    return this.prisma.calendarEvent.findMany({
      include: { user: true, notificationPreference: true },
    });
  }

  async findById(id: number): Promise<CalendarEventWithRelations | null> {
    return this.prisma.calendarEvent.findUnique({
      where: { id },
      include: { user: true, notificationPreference: true },
    });
  }

  async findByType(
    types: CalendarEventType[],
  ): Promise<CalendarEventWithRelations[]> {
    return this.prisma.calendarEvent.findMany({
      where: {
        eventType: {
          in: types,
        },
      },
      include: {
        user: true,
        notificationPreference: true,
      },
    });
  }

  async findByToken(token: string): Promise<CalendarEventWithRelations | null> {
    return this.prisma.calendarEvent.findUnique({
      where: { token },
      include: { user: true, notificationPreference: true },
    });
  }

  async findByUserId(userId: number): Promise<CalendarEventWithRelations[]> {
    return this.prisma.calendarEvent.findMany({
      where: {userId},
      include: {user: true, notificationPreference: true},
    });
  }

  async create(
    userId: number,
    dto: CreateCalendarEventDto,
  ): Promise<CalendarEventWithRelations> {
    console.log("create due date", dto.dueDate ? new Date(dto.dueDate) : null);
    console.log(
      "create start date",
      dto.startDate ? new Date(dto.startDate) : null,
    );
    console.log("create end date", dto.endDate ? new Date(dto.endDate) : null);

    return this.prisma.calendarEvent.create({
      data: {
        googleEventId: dto.googleEventId,
        eventType: dto.eventType || "EVENT",
        title: dto.title,
        description: dto.description,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
        startDate: dto.startDate ? new Date(dto.startDate) : null,
        endDate: dto.endDate ? new Date(dto.endDate) : null,
        isRecurring: dto.isRecurring,
        recurrence: dto.recurrence,
        location: dto.location,
        link: dto.link,
        token: dto.token,
        user: { connect: { id: userId } },
        ...(dto.notificationPreferenceId
          ? {
              notificationPreference: {
                connect: { id: dto.notificationPreferenceId },
              },
            }
          : {}),
      },
      include: { user: true, notificationPreference: true },
    });
  }

  async update(
    userId: number,
    id: number,
    dto: UpdateCalendarEventDto,
  ): Promise<CalendarEventWithRelations> {
    const existingEvent = await this.findById(id);
    if (!existingEvent || existingEvent.userId !== userId) {
      throw new NotFoundException("Calendar event not found");
    }
    console.log("update due date", dto.dueDate ? new Date(dto.dueDate) : null);
    console.log(
      "update start date",
      dto.startDate ? new Date(dto.startDate) : null,
    );
    console.log("update end date", dto.endDate ? new Date(dto.endDate) : null);

    return this.prisma.calendarEvent.update({
      where: { id },
      data: {
        googleEventId: dto.googleEventId,
        eventType: dto.eventType,
        title: dto.title,
        description: dto.description,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
        startDate: dto.startDate ? new Date(dto.startDate) : null,
        endDate: dto.endDate ? new Date(dto.endDate) : null,
        isRecurring: dto.isRecurring,
        recurrence: dto.recurrence,
        location: dto.location,
        link: dto.link,
        token: dto.token,
        notificationSent: dto.notificationSent,
        ...(dto.notificationPreferenceId
          ? {
              notificationPreference: {
                connect: { id: dto.notificationPreferenceId },
              },
            }
          : {}),
      },
      include: { user: true, notificationPreference: true },
    });
  }

  async delete(
    userId: number,
    id: number,
  ): Promise<CalendarEventWithRelations> {
    const existingEvent = await this.findById(id);
    if (!existingEvent || existingEvent.userId !== userId) {
      throw new NotFoundException("Calendar event not found");
    }
    return this.prisma.calendarEvent.delete({
      where: { id },
      include: { user: true, notificationPreference: true },
    });
  }

  async markNotificationAsSent(
    id: number,
  ): Promise<CalendarEventWithRelations> {
    return this.prisma.calendarEvent.update({
      where: { id },
      data: { notificationSent: true },
      include: { user: true, notificationPreference: true },
    });
  }

  /**
   * Sync Google Calendar events (type = EVENT) for the given user.
   */
  async syncFromGoogleCalendar(
    userId: number,
    googleCalendarService: GoogleCalendarService,
  ): Promise<number> {
    const events = await googleCalendarService.getEventsForUser(userId);
    const googleEventIds = new Set(events.map((event) => event.id));

    const existingEvents = await this.prisma.calendarEvent.findMany({
      where: {
        userId,
        googleEventId: { not: null },
        eventType: "EVENT",
      },
    });

    // Delete events no longer in Google Calendar.
    for (const event of existingEvents) {
      if (!googleEventIds.has(event.googleEventId)) {
        await this.delete(userId, event.id);
      }
    }

    const notificationPreference = await this.prisma.notificationPreference.findUnique({
      where: {userId: userId}
    });

    // Update existing events or create new ones.
    for (const event of events) {
      const existingEvent = await this.prisma.calendarEvent.findUnique({
        where: { googleEventId: event.id },
      });
      if (existingEvent) {
        await this.update(userId, existingEvent.id, {
          googleEventId: event.id,
          eventType: "EVENT",
          title: event.summary,
          description: event.description ?? "",
          dueDate: new Date(event.due),
          startDate: new Date(event.start),
          endDate: new Date(event.end),
          isRecurring: event.isRecurring,
          recurrence: event.recurringType,
          location: event.location ?? "",
          link: event.link ?? "",
          token: null,
          notificationPreferenceId: notificationPreference.id,
          notificationSent: null,
        });
      } else {
        await this.create(userId, {
          googleEventId: event.id,
          eventType: "EVENT",
          title: event.summary,
          description: event.description ?? "",
          dueDate: new Date(event.due),
          startDate: new Date(event.start),
          endDate: new Date(event.end),
          isRecurring: event.isRecurring,
          recurrence: event.recurringType,
          location: event.location ?? "",
          link: event.link ?? "",
          token: null,
          notificationPreferenceId: notificationPreference.id,
        });
      }
    }
    return events.length;
  }

  /**
   * Sync Google Tasks (mapped as type = TASK) for the given user.
   */
  async syncFromGoogleTasks(
    userId: number,
    googleCalendarService: GoogleCalendarService,
  ): Promise<number> {
    const tasks = await googleCalendarService.getTasksForUserAsEvents(userId);
    const googleTaskIds = new Set(tasks.map((task) => task.id));

    const existingTasks = await this.prisma.calendarEvent.findMany({
      where: {
        userId,
        googleEventId: { not: null },
        eventType: "TASK",
      },
    });

    // Delete tasks no longer in Google Tasks.
    for (const task of existingTasks) {
      if (!googleTaskIds.has(task.googleEventId)) {
        await this.delete(userId, task.id);
      }
    }

    const notificationPreference = await this.prisma.notificationPreference.findUnique({
      where: {userId: userId}
    });

    // Update existing tasks or create new ones.
    for (const task of tasks) {
      const existingTask = await this.prisma.calendarEvent.findUnique({
        where: { googleEventId: task.id },
      });
      if (existingTask) {
        await this.update(userId, existingTask.id, {
          googleEventId: task.id,
          eventType: "TASK",
          title: task.summary,
          description: task.description,
          dueDate: new Date(task.due),
          startDate: new Date(task.start),
          endDate: new Date(task.end),
          isRecurring: task.isRecurring,
          recurrence: task.recurringType,
          location: task.location,
          link: task.link,
          token: null,
          notificationPreferenceId: notificationPreference.id,
          notificationSent: null,
        });
      } else {
        await this.create(userId, {
          googleEventId: task.id,
          eventType: "TASK",
          title: task.summary,
          description: task.description,
          dueDate: new Date(task.due),
          startDate: new Date(task.start),
          endDate: new Date(task.end),
          isRecurring: task.isRecurring,
          recurrence: task.recurringType,
          location: task.location,
          link: task.link,
          token: null,
          notificationPreferenceId: notificationPreference.id,
        });
      }
    }
    return tasks.length;
  }
}
