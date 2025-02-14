// src/Repository/CalendarEvent/CalendarEventRepository.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../Core/Datasource/Prisma';
import { CreateCalendarEventDto } from '../../Dto/CalendarEventDto/CreateCalendarEventDto';
import { UpdateCalendarEventDto } from '../../Dto/CalendarEventDto/UpdateCalendarEventDto';
import {Prisma, Recurrence} from '@prisma/client';

// Define a type that includes the relations for CalendarEvent.
export type CalendarEventWithRelations = Prisma.CalendarEventGetPayload<{
    include: { user: true; notificationPreference: true };
}>;

@Injectable()
export default class CalendarEventRepository {
    constructor(private readonly prisma: PrismaService) {}

    /**
     * Retrieves all calendar events with relations.
     */
    async find(): Promise<CalendarEventWithRelations[]> {
	  return this.prisma.calendarEvent.findMany({
		include: { user: true, notificationPreference: true },
	  });
    }

    /**
     * Retrieves a calendar event by its ID.
     */
    async findById(id: number): Promise<CalendarEventWithRelations | null> {
	  return this.prisma.calendarEvent.findUnique({
		where: { id },
		include: { user: true, notificationPreference: true },
	  });
    }

    /**
     * Retrieves a calendar event by its token.
     */
    async findByToken(token: string): Promise<CalendarEventWithRelations | null> {
	  return this.prisma.calendarEvent.findUnique({
		where: { token },
		include: { user: true, notificationPreference: true },
	  });
    }

    /**
     * Retrieves all calendar events for a given user.
     */
    async findByUserId(userId: number): Promise<CalendarEventWithRelations[]> {
	  return this.prisma.calendarEvent.findMany({
		where: { userId },
		include: { user: true, notificationPreference: true },
	  });
    }

    /**
     * Creates a new calendar event.
     */
    async create(userId: number, dto: CreateCalendarEventDto): Promise<CalendarEventWithRelations> {
	  return this.prisma.calendarEvent.create({
		data: {
		    googleEventId: dto.googleEventId,
		    eventType: dto.eventType || 'EVENT',
		    title: dto.title,
		    description: dto.description,
		    startDate: new Date(dto.startDate),
		    endDate: new Date(dto.endDate),
		    isRecurring: dto.isRecurring,
		    recurrence: dto.recurrence,
		    location: dto.location,
		    place: dto.place,
		    link: dto.link,
		    token: dto.token,
		    user: { connect: { id: userId } },
		    ...(dto.notificationPreferenceId
			    ? { notificationPreference: { connect: { id: dto.notificationPreferenceId } } }
			    : {}),
		},
		include: { user: true, notificationPreference: true },
	  });
    }

    /**
     * Updates an existing calendar event.
     */
    async update(
	    userId: number,
	    id: number,
	    dto: UpdateCalendarEventDto,
    ): Promise<CalendarEventWithRelations> {
	  const existingEvent = await this.findById(id);
	  if (!existingEvent || existingEvent.userId !== userId) {
		throw new NotFoundException('Calendar event not found');
	  }

	  return this.prisma.calendarEvent.update({
		where: { id },
		data: {
		    googleEventId: dto.googleEventId,
		    eventType: dto.eventType,
		    title: dto.title,
		    description: dto.description,
		    startDate: dto.startDate ? new Date(dto.startDate) : undefined,
		    endDate: dto.endDate ? new Date(dto.endDate) : undefined,
		    isRecurring: dto.isRecurring,
		    recurrence: dto.recurrence,
		    location: dto.location,
		    place: dto.place,
		    link: dto.link,
		    token: dto.token,
		    notificationSent: dto.notificationSent,
		    // Use nested connect if a notificationPreferenceId is provided.
		    ...(dto.notificationPreferenceId
			    ? { notificationPreference: { connect: { id: dto.notificationPreferenceId } } }
			    : {}),
		},
		include: { user: true, notificationPreference: true },
	  });
    }

    /**
     * Deletes a calendar event.
     */
    async delete(userId: number, id: number): Promise<CalendarEventWithRelations> {
	  const existingEvent = await this.findById(id);
	  if (!existingEvent || existingEvent.userId !== userId) {
		throw new NotFoundException('Calendar event not found');
	  }

	  return this.prisma.calendarEvent.delete({
		where: { id },
		include: { user: true, notificationPreference: true },
	  });
    }

    /**
     * Marks a calendar event’s notification as sent.
     */
    async markNotificationAsSent(id: number): Promise<CalendarEventWithRelations> {
	  return this.prisma.calendarEvent.update({
		where: { id },
		data: { notificationSent: true },
		include: { user: true, notificationPreference: true },
	  });
    }
}
