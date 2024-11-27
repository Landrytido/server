import { BadRequestException, Injectable } from "@nestjs/common";
import { ContextualGraphqlRequest, UseCase } from "src";
import MeetingRepository from "src/Api/Repository/MeetingRepository";
import { Meeting } from "@prisma/client";

@Injectable()
export default class GetMeetingByUserIdUseCase
  implements UseCase<Promise<Meeting[]>, []>
{
  constructor(private readonly meetingRepository: MeetingRepository) {}

  async handle(context: ContextualGraphqlRequest): Promise<Meeting[]> {
    try {
      return await this.meetingRepository.findByUserId(context.userId);
    } catch (error) {
      throw new BadRequestException(
        "GetMeetingByUserIdUseCaseFailed",
        error.message
      );
    }
  }
}
