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
      //A supprimer
      console.log("relations", relations)
      //A supprimer

      return relations.map((relation) => {
         //A supprimer
 console.log("relation map", relation);
 
 //A supprimer
        if (relation.senderId == context.userId) {
          return {
            ...relation,
            sender: null,
            receiver: relation.receiver,
          } ;
          
        }
 //A supprimer
 console.log("relations 1er return", relations);
 
 //A supprimer
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
