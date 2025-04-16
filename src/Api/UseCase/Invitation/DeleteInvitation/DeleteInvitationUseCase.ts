import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { ContextualGraphqlRequest, UseCase } from "../../../../index";
import InvitationRepository from "../../../Repository/InvitationRepository";
import { Invitation } from "@prisma/client";
import UserRepository from "src/Api/Repository/UserRepository";
import ShareNoteRepository from "src/Api/Repository/ShareNoteRepository";

@Injectable()
export default class DeleteInvitationUseCase
  implements UseCase<Promise<Invitation>, [invitationId: number]>
{
  constructor(
    private readonly invitationRepository: InvitationRepository,
    private readonly userRepository: UserRepository,
    private readonly sharedNoteRepository: ShareNoteRepository
  ) {}

  async handle(context: ContextualGraphqlRequest, invitationId: number) {
    try {
      const sentInvitations = await this.invitationRepository.findSentInvitations(context.userId);
      const sentInvitation = sentInvitations.find(inv => inv.id === invitationId);
      
      const receivedInvitations = await this.invitationRepository.findReceivedInvitations(context.userId);
      const receivedInvitation = receivedInvitations.find(inv => inv.id === invitationId);
      
      const relations = await this.invitationRepository.findRelations(context.userId);
      const relation = relations.find(rel => rel.id === invitationId);
      
      const invitation = sentInvitation || receivedInvitation || relation;
      
      if (!invitation) {
        throw new NotFoundException("Invitation not found or you don't have permission to delete it");
      }
      
      if (invitation.isRelation) {
        const user = await this.userRepository.findById(context.userId);
        
        if (user.deleteSharedNotesOnRelationEnd) {
          const otherUserId = context.userId === invitation.senderId 
            ? invitation.receiverId 
            : invitation.senderId;
          
          await this.sharedNoteRepository.deleteSharedNotesBetweenUsers(
            context.userId,
            otherUserId
          );
        }
      }
  
      const result = await this.invitationRepository.remove(invitationId);
      return result;
    } catch (error) {
      throw new BadRequestException(
        "DeleteInvitationUseCaseFailed",
        error.message
      );
    }
  }
}
