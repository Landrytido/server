import { Injectable } from "@nestjs/common";
import ServiceFactory from "../../Core/Factory/ServiceFactory";
import { AvailableUserUseCases } from "./User/AvailableUserUseCases";
import { AvailableNotebookUseCases } from "./Notebook/AvailableNotebookUseCases";
import { AvailableNoteUseCases } from "./Note/AvailbaleNoteUseCases";
import {AvailableInvitationUseCases} from "./Invitation/AvailableInvitationUseCases";

type UseCases = AvailableUserUseCases | AvailableNotebookUseCases | AvailableNoteUseCases | AvailableInvitationUseCases;

@Injectable()
export default class UseCaseFactory extends ServiceFactory<UseCases> {}
