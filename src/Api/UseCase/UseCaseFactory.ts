import { Injectable } from "@nestjs/common";
import ServiceFactory from "../../Core/Factory/ServiceFactory";
import { AvailableUserUseCases } from "./User/AvailableUserUseCases";
import { AvailableTagUseCases } from "./Tag/AvailableTagUseCases";
import { AvailableTaskUseCases } from "./Task/AvailableTaskUseCases";

type UseCases = AvailableUserUseCases | AvailableTagUseCases | AvailableTaskUseCases;

@Injectable()
export default class UseCaseFactory extends ServiceFactory<UseCases> {}
