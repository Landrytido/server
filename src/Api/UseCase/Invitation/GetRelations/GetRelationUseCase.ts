import { BadRequestException, Injectable } from "@nestjs/common";
import { Invitation } from "@prisma/client";
import { ContextualGraphqlRequest, UseCase } from "src";
import InvitationRepository from "src/Api/Repository/InvitationRepository";

@Injectable()
export default class GetRelationsUseCase
  implements UseCase<Promise<Invitation[]>, []>
{
  constructor(private readonly invitationRepository: InvitationRepository) {}
  async handle(context: ContextualGraphqlRequest) {
    try {
      const relations = await this.invitationRepository.findRelations(
        context.userId
      );

      return relations.map((relation) => {
        if (relation.senderId == context.userId) {
          return {
            ...relation,
            sender: null,
            receiver: relation.receiver,
          };
        }

        return {
          ...relation,
          receiver: null,
          sender: relation.sender,
        };
      });
    } catch (error) {
      throw new BadRequestException(
        "GetInvitationUseCaseFailed",
        error.message
      );
    }
  }
}
