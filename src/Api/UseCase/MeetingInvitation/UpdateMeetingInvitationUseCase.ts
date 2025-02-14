import { ForbiddenException, Injectable } from "@nestjs/common";
import { UncontextualUseCase } from "src";
import SaveMeetingInvitationDto from "src/Api/Dto/SaveMeetingInvitationDto";
import MeetingInvitation from "src/Api/Entity/MeetingInvitation";
import MeetingInvitationRepository from "src/Api/Repository/MeetingInvitationRepository";

@Injectable()
export default class UpdateMeetingInvitationUseCase
  implements
    UncontextualUseCase<
      Promise<MeetingInvitation>,
      [dto: SaveMeetingInvitationDto]
    >
{
  constructor(
    private readonly meetingInvitationRepository: MeetingInvitationRepository,
  ) {}

  async handle(dto: SaveMeetingInvitationDto): Promise<MeetingInvitation> {
    try {
      return await this.meetingInvitationRepository.update(dto);
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }
}
