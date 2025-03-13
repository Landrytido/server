import { Injectable } from "@nestjs/common";
import ServiceFactoryUncontextualUseCase from "../../Core/Factory/ServiceFactoryUncontextualUseCase";
import CreateUserUseCase from "./User/CreateUser/CreateUserUseCase";
import ConvertExternalInvitationUseCase from "./Invitation/ConvertExternalInvitation/ConvertExternalInvitationUseCase";
import GetExternalEmailByTokenUseCase from "./Invitation/GetExternalEmailByToken/GetExternalEmailByTokenUseCase";
import { AvailableCalendarEventInvitationUseCases } from "./CalendarEventInvitation/AvailableCalendarEventUseCases";

type UncontextualUseCases =
  | CreateUserUseCase
  | ConvertExternalInvitationUseCase
  | GetExternalEmailByTokenUseCase | AvailableCalendarEventInvitationUseCases;

@Injectable()
export default class UncontextualUseCaseFactory extends ServiceFactoryUncontextualUseCase<UncontextualUseCases> {}
