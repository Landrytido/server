import { Injectable } from '@nestjs/common';
import ServiceFactory from '../../Core/Factory/ServiceFactory';
import { AvailableUserUseCases } from "./User/AvailableUserUseCases";
import { AvailableEventUseCases } from './Event/AvailableEventUseCases';

export type UseCases = AvailableEventUseCases | AvailableUserUseCases;

@Injectable()
export default class UseCaseFactory extends ServiceFactory<UseCases> {}


