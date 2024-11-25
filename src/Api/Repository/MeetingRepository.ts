import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../Core/Datasource/Prisma";
import { Prisma } from "@prisma/client";

@Injectable()
export default class MeetingRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: number) {
    return this.prisma.meeting.findUnique({
      where: { id },
    });
  }

  async saveMeeting(
    data:
      | Prisma.XOR<Prisma.MeetingCreateInput, Prisma.MeetingUncheckedCreateInput>
      | Prisma.XOR<Prisma.MeetingUpdateInput, Prisma.MeetingUncheckedUpdateInput>
  ) {
    if (!data.id) {
      return this.prisma.meeting.create({
        data: data as Prisma.XOR<
          Prisma.MeetingCreateInput,
          Prisma.MeetingUncheckedCreateInput
        >,
      });
    }

    return this.prisma.meeting.update({
      where: { id: data.id as number },
      data: data as Prisma.XOR<
        Prisma.MeetingUpdateInput,
        Prisma.MeetingUncheckedUpdateInput
      >,
    });
  }

  async delete(id: number) {
    return this.prisma.meeting.delete({
      where: { id },
    });
  }

  async findAll() {
    return this.prisma.meeting.findMany();
  }

  async findByUserId(userId: number) {
    return this.prisma.meeting.findMany({
      where: { userId: userId },
    });
  }
}
