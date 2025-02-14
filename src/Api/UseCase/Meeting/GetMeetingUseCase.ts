import { Injectable, NotFoundException } from "@nestjs/common";
import { Meeting } from "@prisma/client";
import { ContextualGraphqlRequest } from "src";
import MeetingRepository from "src/Api/Repository/MeetingRepository";

@Injectable()
export default class GetMeetingUseCase {
  constructor(private readonly meetingRepository: MeetingRepository) {}

  async handle(context: ContextualGraphqlRequest, id: number): Promise<Meeting> {
    const meeting = await this.meetingRepository.findById(id);

    if (!meeting) {
      throw new NotFoundException("Meeting not found");
    }

    return meeting;
  }
}
