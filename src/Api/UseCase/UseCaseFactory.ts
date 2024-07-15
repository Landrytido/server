import { Injectable } from '@nestjs/common';
import ServiceFactory from '../../Core/Factory/ServiceFactory';
import { AvailableUserUseCases } from "./User/AvailableUserUseCases";
import { AvailableNotebookUseCases } from './Notebook/AvailableNotebookUseCases';

type UseCases = AvailableUserUseCases | AvailableNotebookUseCases;

@Injectable()
export default class UseCaseFactory extends ServiceFactory<UseCases> {}
