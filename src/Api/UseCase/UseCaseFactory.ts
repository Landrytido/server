import { Injectable } from "@nestjs/common";
import ServiceFactory from "../../Core/Factory/ServiceFactory";
import { AvailableUserUseCases } from "./User/AvailableUserUseCases";
import { AvailableLinkGroupUseCases } from "./LinkGroup/AvailableLinkGroupUseCases";
import { AvailableLinkUseCases } from "./Link/AvailableLinkUseCases";
import { AvailableLinkClickUseCases } from "./LinkClick/AvailableLinkClickUseCases";
import { AvailableEventUseCases } from "./Event/AvailableEventUseCases";
import { AvailableTagUseCases } from "./Tag/AvailableTagUseCases";
import { AvailableTaskUseCases } from "./Task/AvailableTaskUseCases";
import { AvailableNoteUseCases } from "./Note/AvailbaleNoteUseCases";
import { AvailableNotebookUseCases } from "./Notebook/AvailableNotebookUseCases";
import { AvailableInvitationUseCases } from "./Invitation/AvailableInvitationUseCases";
import { AvailableSearchHistoryUseCases } from "./SearchHistory/AvailableSearchHistoryUseCases";
import { AvailableCommentUseCases } from "./Comment/AvailableCommentUseCases";
import { AvailableNoteTaskUseCases } from "./NoteTasks/AvailableNoteTaskskUseCases";

export type UseCases =
  | AvailableUserUseCases
  | AvailableEventUseCases
  | AvailableTagUseCases
  | AvailableTaskUseCases
  | AvailableNotebookUseCases
  | AvailableNoteUseCases
  | AvailableInvitationUseCases
  | AvailableLinkGroupUseCases
  | AvailableLinkUseCases
  | AvailableLinkClickUseCases
  | AvailableSearchHistoryUseCases
  | AvailableCommentUseCases
  | AvailableNoteTaskUseCases;


@Injectable()
export default class UseCaseFactory extends ServiceFactory<UseCases> {}