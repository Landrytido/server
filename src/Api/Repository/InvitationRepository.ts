import { Prisma } from "@prisma/client";
import { PrismaService } from "../../Core/Datasource/Prisma";
import { Injectable } from "@nestjs/common";

@Injectable()
export default class InvitationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findReceiverIdByEmail(email: string) {
    const result = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    return result;
  }

  async findPendingInvitationsByEmail(email: string) {
    return this.prisma.invitation.findMany({
      where: {
        externalEmailInvitation: email,
        receiverId: null,
        isExternal: true,
      },
    });
  }

  async findInvitationBySenderAndReceiver(
    senderId: number,
    receiverId: number
  ) {
    const result = this.prisma.invitation.findFirst({
      where: {
        receiverId: receiverId,
        senderId: senderId,
      },
    });
    return result;
  }

  async findInvitationBySenderAndexternalEmailInvitation(
    senderId: number,
    externalEmailInvitation: string
  ) {
    const result = this.prisma.invitation.findFirst({
      where: {
        externalEmailInvitation,
        senderId,
      },
    });
    return result;
  }

  async findSentInvitations(senderId: number) {
    return this.prisma.invitation.findMany({
      where: { senderId, AND: [{ isRelation: false }] },
      include: {
        receiver: true,
        sender: true,
      },
    });
  }

  async findReceivedInvitations(receiverId: number) {
    const invitations = await this.prisma.invitation.findMany({
      where: { receiverId, AND: [{ isRelation: false }] },
      include: {
        receiver: true,
        sender: true,
      },
    });
    return invitations;
  }

  async findInvitationByToken(token: string) {
    const invitation = await this.prisma.invitation.findFirst({
      where: {
        tokenForExternalInvitation: token,
      },
    });
    console.log("invitation token repo:", invitation);
    return invitation;
  }

  async findRelations(userId: number) {
    const relations = await this.prisma.invitation.findMany({
      where: {
        OR: [{ receiverId: userId }, { senderId: userId }],
        AND: [{ isRelation: true }],
      },
      include: {
        sender: true,
        receiver: true,
      },
    });
    return relations;
  }

  async acceptInvitation(invitationId: number) {
    return this.prisma.invitation.update({
      where: {
        id: invitationId,
      },
      data: {
        isRelation: true,
      },
      include: {
        sender: true,
      },
    });
  }

  async save(
    data:
      | Prisma.XOR<
          Prisma.InvitationCreateInput,
          Prisma.InvitationUncheckedCreateInput
        >
      | Prisma.XOR<
          Prisma.InvitationUpdateInput,
          Prisma.InvitationUncheckedUpdateInput
        >
  ) {
    if (!data.id) {
      return this.prisma.invitation.create({
        data: data as Prisma.XOR<
          Prisma.InvitationCreateInput,
          Prisma.InvitationUncheckedCreateInput
        >,
      });
    }

    return this.prisma.invitation.update({
      where: { id: data.id as number },
      data: data as Prisma.XOR<
        Prisma.InvitationUpdateInput,
        Prisma.InvitationUncheckedUpdateInput
      >,
    });
  }

  async remove(invitationId: number) {
    const result = this.prisma.invitation.delete({
      where: { id: invitationId },
    });
    return result;
  }
}
