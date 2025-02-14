import { Injectable } from "@nestjs/common";
import { InvitationStatus, Prisma } from "@prisma/client";
import { PrismaService } from "src/Core/Datasource/Prisma";
import SaveMeetingInvitationDto from "../Dto/SaveMeetingInvitationDto";

@Injectable()
export default class MeetingInvitationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: number) {
    return this.prisma.meetingInvitation.findUnique({
      where: { id },
    });
  }

  async findByReceiverId(id: number) {
    return this.prisma.meetingInvitation.findMany({
      where: { receiverId: id },
    });
  }

  async findBySenderId(id: number) {
    return this.prisma.meetingInvitation.findMany({
      where: { senderId: id },
    });
  }

  async findByMeetingId(id: number) {
    return this.prisma.meetingInvitation.findMany({
      where: { meetingId: id },
    });
  }

  async create(dto: SaveMeetingInvitationDto) {
    return this.prisma.meetingInvitation.create({
      data: dto,
    });
  }

  async update(
    dto: Prisma.XOR<
      Prisma.MeetingInvitationUpdateInput,
      Prisma.MeetingInvitationUncheckedUpdateInput
    >,
  ) {
    return this.prisma.meetingInvitation.update({
      where: { id: dto.id as number },
      data: dto as Prisma.XOR<
        Prisma.MeetingInvitationUpdateInput,
        Prisma.MeetingInvitationUncheckedUpdateInput
      >,
    });
  }

  async accept(id: number) {
    return this.prisma.meetingInvitation.update({
      where: { id },
      data: {
        status: InvitationStatus.ACCEPTED,
      },
    });
  }

  async deny(id: number) {
    return this.prisma.meetingInvitation.update({
      where: { id },
      data: {
        status: InvitationStatus.REFUSED,
      },
    });
  }

  async delete(id: number) {
    return this.prisma.meetingInvitation.delete({
      where: { id },
    });
  }
}
