import CreateInvitationUseCase from "./CreateInvitation/CreateInvitationUseCase";
import DeleteInvitationUseCase from "./DeleteInvitation/DeleteInvitationUseCase";
import AcceptInvitationUseCase from "./AcceptInvitation/AcceptInvitationUseCase";
import GetSentInvitationsUseCase from "./GetSentInvitations/GetSentInvitationsUseCase";
import GetReceivedInvitationsUseCase from "./GetReceivedInvitations/GetReceivedInvitationsUseCase";
import GetRelationUseCase from "./GetRelations/GetRelationUseCase";
import ConvertExternalInvitationUseCase from "./ConvertExternalInvitation/ConvertExternalInvitationUseCase";

export type AvailableInvitationUseCases =
  | CreateInvitationUseCase
  | DeleteInvitationUseCase
  | AcceptInvitationUseCase
  | GetSentInvitationsUseCase
  | GetReceivedInvitationsUseCase
  | GetRelationUseCase
  | ConvertExternalInvitationUseCase;
