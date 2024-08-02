import { Injectable } from '@nestjs/common';
import ServiceFactory from '../../Core/Factory/ServiceFactory';
import { AvailableUserUseCases } from "./User/AvailableUserUseCases";
import { AvailableLinkGroupUseCases } from "./LinkGroup/AvailableLinkGroupUseCases";

type UseCases = AvailableUserUseCases | AvailableLinkGroupUseCases;

@Injectable()
export default class UseCaseFactory extends ServiceFactory<UseCases> {}
