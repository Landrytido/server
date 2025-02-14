import { Injectable, NotFoundException } from "@nestjs/common";
import { Meeting } from "@prisma/client";
import { ContextualGraphqlRequest } from "src";
import MeetingRepository from "src/Api/Repository/MeetingRepository";

// TODO: Remove this model after refactoring tasks, events, meetings into CalendarEvent ❌
@Injectable()
export default class GetAllMeetingUseCase {
  constructor(private readonly meetingRepository: MeetingRepository) {}

  async handle(context: ContextualGraphqlRequest): Promise<Meeting[]> {
    const meetings = await this.meetingRepository.findAll();

    if (!meetings || meetings.length === 0) {
      throw new NotFoundException("No meetings found");
    }

    return meetings;
  }
}
