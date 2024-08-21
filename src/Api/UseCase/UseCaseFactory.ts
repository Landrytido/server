import { Injectable } from "@nestjs/common";
import ServiceFactory from "../../Core/Factory/ServiceFactory";
import { AvailableUserUseCases } from "./User/AvailableUserUseCases";
import { AvailableTagUseCases } from "./Tag/AvailableTagUseCases";
import { AvailableTaskUseCases } from "./Task/AvailableTaskUseCases";
import { AvailableNotebookUseCases } from "./Notebook/AvailableNotebookUseCases";
import { AvailableNoteUseCases } from "./Note/AvailbaleNoteUseCases";
import {AvailableInvitationUseCases} from "./Invitation/AvailableInvitationUseCases";
import { AvailableEventUseCases } from './Event/AvailableEventUseCases';

export type UseCases = AvailableUserUseCases |AvailableEventUseCases| AvailableTagUseCases | AvailableTaskUseCases| AvailableNotebookUseCases | AvailableNoteUseCases | AvailableInvitationUseCases;

@Injectable()
export default class UseCaseFactory extends ServiceFactory<UseCases> {}


