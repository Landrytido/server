import { Injectable } from "@nestjs/common";
import ServiceFactoryUncontextualUseCase from "../../Core/Factory/ServiceFactoryUncontextualUseCase";
import CreateUserUseCase from "./User/CreateUser/CreateUserUseCase";
import ConvertExternalInvitationUseCase from "./Invitation/ConvertExternalInvitation/ConvertExternalInvitationUseCase";
import GetExternalEmailByTokenUseCase from "./Invitation/GetExternalEmailByToken/GetExternalEmailByTokenUseCase";
import { AvailableMeetingInvitationUseCases } from "./MeetingInvitation/AvailableMeetingInvitationUseCase";

type UncontextualUseCases =
  | CreateUserUseCase
  | ConvertExternalInvitationUseCase
  | GetExternalEmailByTokenUseCase
  | AvailableMeetingInvitationUseCases;

@Injectable()
export default class UncontextualUseCaseFactory extends ServiceFactoryUncontextualUseCase<UncontextualUseCases> {}
