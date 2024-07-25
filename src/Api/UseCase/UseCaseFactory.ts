import { Injectable } from "@nestjs/common";
import ServiceFactory from "../../Core/Factory/ServiceFactory";
import { AvailableUserUseCases } from "./User/AvailableUserUseCases";
import { AvailableNotebookUseCases } from "./Notebook/AvailableNotebookUseCases";
import { AvailableNoteUseCases } from "./Note/AvailbaleNoteUseCases";

type UseCases =
  | AvailableUserUseCases
  | AvailableNotebookUseCases
  | AvailableNoteUseCases;

@Injectable()
export default class UseCaseFactory extends ServiceFactory<UseCases> {}
