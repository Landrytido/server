import { BadRequestException, Injectable } from "@nestjs/common";
import { ContextualGraphqlRequest, UseCase } from "src";
import { Relation } from "src/Api/Entity/Relation";
import InvitationRepository from "src/Api/Repository/InvitationRepository";

@Injectable()
export default class GetRelationsUseCase
  implements UseCase<Promise<Relation[]>, []>
{
  constructor(private readonly invitationRepository: InvitationRepository) {}
  async handle(context: ContextualGraphqlRequest) {
    try {
      const relations = await this.invitationRepository.findRelations(
        context.userId
      );

      const validRelations = relations.filter(
        (relation) => relation.isRelation
      );
      const relationInfos = validRelations.map((relation) => {
        const isSender = relation.senderId === context.userId;
        return {
          invitationId: relation.id,
          friendEmail: isSender
            ? relation.receiver.email
            : relation.sender.email,
          friendFirstName: isSender
            ? relation.receiver.firstName
            : relation.sender.firstName,
          friendLastName: isSender
            ? relation.receiver.lastName
            : relation.sender.lastName,
          sender: relation.sender,
          receiver: relation.receiver,
        };
      });
      return relationInfos;
    } catch (error) {
      throw new BadRequestException(
        "GetInvitationUseCaseFailed",
        error.message
      );
    }
  }
}
