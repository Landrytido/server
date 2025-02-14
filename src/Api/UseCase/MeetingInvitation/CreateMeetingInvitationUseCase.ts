import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";

import { UncontextualUseCase } from "src";

import SaveMeetingInvitationDto from "src/Api/Dto/SaveMeetingInvitationDto";
import MeetingInvitation from "src/Api/Entity/MeetingInvitation";
import MeetingInvitationRepository from "src/Api/Repository/MeetingInvitationRepository";
import UserRepository from "src/Api/Repository/UserRepository";

@Injectable()
export default class CreateMeetingInvitaionUseCase
  implements
    UncontextualUseCase<
      Promise<MeetingInvitation[]>,
      [dto: SaveMeetingInvitationDto]
    >
{
  constructor(
    private readonly userRepository: UserRepository,
    private readonly meetingInvitationRepository: MeetingInvitationRepository,
  ) {}
  async handle(dto: SaveMeetingInvitationDto): Promise<MeetingInvitation[]> {
    try {
      let meetingInvitations: MeetingInvitation[] = [];

      dto.updatedAt = dto.updatedAt ? new Date(dto.updatedAt) : new Date();

      const { id, invitedEmails, ...dataWithoutId } = dto;

      console.log("Invited Emails:", invitedEmails);

      for (const currentEmail of invitedEmails) {
        try {
          let currentInvitation = { ...dataWithoutId, invitedEmails };

          console.log("Processing email:", currentEmail);

          const currentUser =
            await this.userRepository.findByEmail(currentEmail);

          if (!currentUser) {
            console.error(`User not found for email: ${currentEmail}`);
            continue; // Skip this email instead of throwing an error
          } else {
            console.log("Found User:", currentUser);

            currentInvitation.receiverId = currentUser.id;

            const createdInvitation =
              await this.meetingInvitationRepository.create({
                senderId: dto.senderId,
                receiverId: currentUser.id,
                meetingId: dto.meetingId,
                updatedAt: dto.updatedAt,
                status: "PENDING",
              });

            console.log("Created Invitation:", createdInvitation);

            meetingInvitations.push(createdInvitation);
          }
        } catch (error) {
          console.error(
            `Error processing email ${currentEmail}:`,
            error.message,
          );
        }
      }

      return meetingInvitations;
    } catch (error) {
      console.error("Error in CreateMeetingInvitationUseCase:", error.message);
      throw new ForbiddenException(error.message);
    }
  }
}
