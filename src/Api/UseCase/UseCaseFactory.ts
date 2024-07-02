import { Injectable } from '@nestjs/common';
import ServiceFactory from '../../Core/Factory/ServiceFactory';
import { AvailableUserUseCases } from "./User/AvailableUserUseCases";

type UseCases = AvailableUserUseCases;

@Injectable()
export default class UseCaseFactory extends ServiceFactory<UseCases> {}
