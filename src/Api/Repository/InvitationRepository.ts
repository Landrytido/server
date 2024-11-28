import { Prisma } from "@prisma/client";
import { PrismaService } from "../../Core/Datasource/Prisma";
import { Injectable } from "@nestjs/common";

@Injectable()
export default class InvitationRepository {
  constructor(private readonly prisma: PrismaService) {}

  //A remettre
  // async findReceiverIdByEmail(email: string) {
  //   return this.prisma.user.findUnique({
  //     where: {
  //       email,
  //     },
  //   });
  // }
  //A remettre
  //A supprimer
  async findReceiverIdByEmail(email: string) {
    const result = this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    console.log("findReceiverIdByEmail", result);
    return result;
  }
  //A supprimer

  //A remettre
  // async findInvitationBySenderAndReceiver(
  //   senderId: number,
  //   receiverId: number
  // ) {
  //   return this.prisma.invitation.findFirst({
  //     where: {
  //       receiverId: receiverId,
  //       senderId: senderId,
  //     },
  //   });
  // }
  //A remettre
  //A supprimer
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
    console.log("findInvitationBySenderAndReceiver", result);
    return result;
  }
  //A supprimer

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
    console.log("findReceivedInvitations repo", invitations);
    return invitations;
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
    //A supprimer
    console.log("findRelations", relations);

    //A supprimer
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

  // async remove(invitationId: number) {
  //   return this.prisma.invitation.delete({
  //     where: { id: invitationId },
  //   });
  // }

  //A supprimer, je veux juste tester les retours
  //séparateur
  async remove(invitationId: number) {
    const result = this.prisma.invitation.delete({
      where: { id: invitationId },
    });
    console.log("prisma result", result);
    return result;
  }
  //séparateur
}
