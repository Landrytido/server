import { BadRequestException, Injectable } from "@nestjs/common";
import { Invitation } from "@prisma/client";
import { ContextualGraphqlRequest, UseCase } from "src";
import { Relation } from "src/Api/Entity/Relation";
import InvitationRepository from "src/Api/Repository/InvitationRepository";

@Injectable()
//à rajouter implements UseCase<Promise<Invitation[]>, []> à rajouter
export default class GetRelationsUseCase
  implements UseCase<Promise<Relation[]>, []>
{
  constructor(private readonly invitationRepository: InvitationRepository) {}
  async handle(context: ContextualGraphqlRequest) {
    try {
      const relations = await this.invitationRepository.findRelations(
        context.userId
      );
      //A rajouter
      //       //A supprimer
      //       console.log("relations", relations)
      //       //A supprimer

      //       return relations.map((relation) => {
      //          //A supprimer
      //  console.log("relation map", relation);

      //  //A supprimer
      //         if (relation.senderId == context.userId) {
      //           return {
      //             ...relation,
      //             sender: null,
      //             receiver: relation.receiver,
      //           } ;

      //         }
      //  //A supprimer
      //  console.log("relations 1er return", relations);

      //  //A supprimer
      //         return {
      //           ...relation,
      //           receiver: null,
      //           sender: relation.sender,
      //         };

      //       });

      //     }
      //A rajouter

      //A voir si je rajoute ça, c'était ma 2e modif
      // return relations.map(
      //   (relation) => {
      //     return {
      //       ...relation,
      //     };
      //   },
      //   console.log("getRelationUseCase", relations)
      // );
      //2e modif

      // Filtrer uniquement les relations valides
      const validRelations = relations.filter(
        (relation) => relation.isRelation
      );
      const emailRelations = validRelations.map((relation) => {
        const isSender = relation.senderId === context.userId;
        return {
          invitationId: relation.id,
          friendEmail: isSender
            ? relation.receiver.email
            : relation.sender.email,
          sender: relation.sender,
          receiver: relation.receiver,
        };
      });
      console.log("emailFriend", emailRelations);
      return emailRelations;
    } catch (error) {
      throw new BadRequestException(
        "GetInvitationUseCaseFailed",
        error.message
      );
    }
  }
}
