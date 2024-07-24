import { Injectable } from "@nestjs/common";
import ServiceFactory from "../../Core/Factory/ServiceFactory";
import { AvailableUserUseCases } from "./User/AvailableUserUseCases";
import { AvailableTagUseCases } from "./Tag/AvailableTagUseCases";

type UseCases = AvailableUserUseCases | AvailableTagUseCases;

@Injectable()
export default class UseCaseFactory extends ServiceFactory<UseCases> {}
