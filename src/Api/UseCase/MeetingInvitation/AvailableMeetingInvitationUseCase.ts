import AcceptMeetingInvitation from "./AcceptMeetingInvitationUseCase";
import CreateMeetingInvitaionUseCase from "./CreateMeetingInvitationUseCase";
import DeleteMeetingInvitationUseCase from "./DeleteMeetingInvitationUseCase";
import DenyMeetingInvitation from "./DenyMeetingInvitationUseCase";
import GetMeetingInvitationByIdUseCase from "./GetMeetingInvitationByIdUseCase";
import GetMeetingInvitationByMeetingIdUseCase from "./GetMeetingInvitationByMeetingIdUseCase";
import GetMeetingInvitationByReceiverIdUseCase from "./GetMeetingInvitationByReceiverIdUseCase";
import GetMeetingInvitationBySenderIdUseCase from "./GetMeetingInvitationBySenderIdUseCase";
import UpdateMeetingInvitationUseCase from "./UpdateMeetingInvitationUseCase";

export type AvailableMeetingInvitationUseCases =
  | CreateMeetingInvitaionUseCase
  | UpdateMeetingInvitationUseCase
  | GetMeetingInvitationByIdUseCase
  | GetMeetingInvitationBySenderIdUseCase
  | GetMeetingInvitationByReceiverIdUseCase
  | GetMeetingInvitationByMeetingIdUseCase
  | DeleteMeetingInvitationUseCase
  | AcceptMeetingInvitation
  | DenyMeetingInvitation;
