import { Injectable } from "@nestjs/common";

import { CalendarEventInvitation, InvitationStatus } from "@prisma/client";

import CreateCalendarEventInvitationDto from "src/Api/Dto/CalendarEventInvitationDto/CreateCalendarEventInvitationDto";

import { PrismaService } from "src/Core/Datasource/Prisma";

@Injectable()
export default class CalendarEventInvitationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: number): Promise<CalendarEventInvitation> {
    return this.prisma.calendarEventInvitation.findUnique({
      where: { id },
      include: { calendarEvent: true },
    });
  }

  async findByReceiverEmail(email: string): Promise<CalendarEventInvitation[]> {
    return this.prisma.calendarEventInvitation.findMany({
      where: { receiverEmail: email },
      include: { calendarEvent: true },
    });
  }

  async findBySenderId(id: number): Promise<CalendarEventInvitation[]> {
    return this.prisma.calendarEventInvitation.findMany({
      where: { senderId: id },
      include: { calendarEvent: true },
    });
  }

  async findByCalendarEventId(id: number): Promise<CalendarEventInvitation[]> {
    return this.prisma.calendarEventInvitation.findMany({
      where: { calendarEventId: id },
      include: { calendarEvent: true },
    });
  }

  async create(
    dto: CreateCalendarEventInvitationDto,
  ): Promise<CalendarEventInvitation> {
    return this.prisma.calendarEventInvitation.create({
      data: {
        senderId: dto.senderId,
        receiverEmail: dto.receiverEmail,
        calendarEventId: dto.calendarEventId,
      },
      include: { calendarEvent: true },
    });
  }

  async accept(id: number): Promise<CalendarEventInvitation> {
    return this.prisma.calendarEventInvitation.update({
      where: { id },
      data: {
        status: InvitationStatus.ACCEPTED,
      },
      include: { calendarEvent: true },
    });
  }

  async deny(id: number): Promise<CalendarEventInvitation> {
    return this.prisma.calendarEventInvitation.update({
      where: { id },
      data: {
        status: InvitationStatus.REFUSED,
      },
      include: { calendarEvent: true },
    });
  }

  async delete(id: number): Promise<CalendarEventInvitation> {
    return this.prisma.calendarEventInvitation.delete({
      where: { id },
      include: { calendarEvent: true },
    });
  }
}
