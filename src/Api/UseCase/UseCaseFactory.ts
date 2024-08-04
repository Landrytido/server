import { Injectable } from "@nestjs/common";
import ServiceFactory from "../../Core/Factory/ServiceFactory";
import { AvailableUserUseCases } from "./User/AvailableUserUseCases";
import { AvailableLinkGroupUseCases } from "./LinkGroup/AvailableLinkGroupUseCases";
import { AvailableLinkUseCases } from "./Link/AvailableLinkUseCases";

type UseCases =
  | AvailableUserUseCases
  | AvailableLinkGroupUseCases
  | AvailableLinkUseCases;

@Injectable()
export default class UseCaseFactory extends ServiceFactory<UseCases> {}
