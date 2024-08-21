import { Injectable } from "@nestjs/common";
import ServiceFactory from "../../Core/Factory/ServiceFactory";
import { AvailableUserUseCases } from "./User/AvailableUserUseCases";
import { AvailableLinkGroupUseCases } from "./LinkGroup/AvailableLinkGroupUseCases";
import { AvailableLinkUseCases } from "./Link/AvailableLinkUseCases";
import { AvailableLinkClickUseCases } from "./LinkClick/AvailableLinkClickUseCases";

type UseCases =
  | AvailableUserUseCases
  | AvailableLinkGroupUseCases
  | AvailableLinkUseCases
  | AvailableLinkClickUseCases;

@Injectable()
export default class UseCaseFactory extends ServiceFactory<UseCases> {}
