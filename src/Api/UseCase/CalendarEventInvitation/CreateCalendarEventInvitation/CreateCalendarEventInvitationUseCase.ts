import { ForbiddenException, Inject, Injectable } from "@nestjs/common";
import { CalendarEventInvitation } from "@prisma/client";

import { UncontextualUseCase } from "src";
import CreateCalendarEventInvitationDto from "src/Api/Dto/CalendarEventInvitationDto/CreateCalendarEventInvitationDto";

import CalendarEventInvitationRepository from "src/Api/Repository/CalendarEventInvitation/CalendarEventInvitationRepository";
import InvitationRepository from "src/Api/Repository/InvitationRepository";
import UserRepository from "src/Api/Repository/UserRepository";
import Mailer from "src/Core/Mailing/Mailer";
import Authenticator from "src/Core/Security/Service/authentication/Authenticator";

@Injectable()
export default class CreateMeetingInvitaionUseCase
  implements
    UncontextualUseCase<
      Promise<CalendarEventInvitation[]>,
      [invitedEmails: string[], dto: CreateCalendarEventInvitationDto]
    >
{
  constructor(
    @Inject("Authenticator") private authenticator: Authenticator,
    private readonly userRepository: UserRepository,
    private readonly invitationRepository: InvitationRepository,
    private readonly calendarEventRepository: CalendarEventInvitationRepository,
    private readonly mailer: Mailer,
  ) {}
  async handle(
    invitedEmails: string[],
    dto: CreateCalendarEventInvitationDto,
  ): Promise<CalendarEventInvitation[]> {
    try {
      let calendarEventInvitations: CalendarEventInvitation[] = [];

      for (const currentEmail of invitedEmails) {
        try {
          const currentUser =
            await this.userRepository.findByEmail(currentEmail);

          if (!currentUser) {
            console.error(`User not found for email: ${currentEmail}`);

            const sender = await this.userRepository.findById(dto.senderId);

            const token = await this.authenticator.createToken({
              email: currentEmail,
              userId: dto.senderId,
            });

            // NOTE: Sending friend request to user
            const invitation = await this.invitationRepository.save({
              externalEmailInvitation: currentEmail,
              senderId: dto.senderId,
              tokenForExternalInvitation: token,
              isExternal: true,
            });

            const invitationLink = `${process.env.FRONTEND_URL}/external-invitation?token=${token}`;

            this.mailer.sendInvitationEmail(
              currentEmail,
              {
                firstName: sender.firstName,
                lastName: sender.firstName,
              },
              invitationLink,
            );
          } else {
            await this.invitationRepository.save({
              externalEmailInvitation: currentEmail,
              receiverId: currentUser.id,
              senderId: dto.senderId,
              isExternal: false,
            });
          }

          const createdInvitation = await this.calendarEventRepository.create({
            senderId: dto.senderId,
            receiverEmail: currentEmail,
            calendarEventId: dto.calendarEventId,
          });

          calendarEventInvitations.push(createdInvitation);
        } catch (error) {
          console.error(
            `Error processing email ${currentEmail}:`,
            error.message,
          );
        }
      }

      return calendarEventInvitations;
    } catch (error) {
      console.error(
        "Error in CreateCalendarEventInvitationUseCase:",
        error.message,
      );
      throw new ForbiddenException(error.message);
    }
  }
}
