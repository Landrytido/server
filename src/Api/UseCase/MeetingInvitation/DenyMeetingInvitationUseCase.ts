import { BadRequestException, Injectable } from "@nestjs/common";
import { UncontextualUseCase } from "src";
import MeetingInvitation from "src/Api/Entity/MeetingInvitation";
import MeetingInvitationRepository from "src/Api/Repository/MeetingInvitationRepository";

@Injectable()
export default class DenyMeetingInvitation
  implements UncontextualUseCase<Promise<MeetingInvitation>, [id: number]>
{
  constructor(
    private readonly meetingInvitationRepository: MeetingInvitationRepository,
  ) {}

  async handle(id: number): Promise<MeetingInvitation> {
    try {
      return await this.meetingInvitationRepository.deny(id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
