import { Injectable } from "@nestjs/common";
import ServiceFactoryUncontextualUseCase from "../../Core/Factory/ServiceFactoryUncontextualUseCase";
import CreateUserUseCase from "./User/CreateUser/CreateUserUseCase";
import ConvertExternalInvitationUseCase from "./Invitation/ConvertExternalInvitation/ConvertExternalInvitationUseCase";

type UncontextualUseCases =
  | CreateUserUseCase
  | ConvertExternalInvitationUseCase;

@Injectable()
export default class UncontextualUseCaseFactory extends ServiceFactoryUncontextualUseCase<UncontextualUseCases> {}
