// src/Api/UseCase/BlocNotes/GetBlocNotesByUserId/GetBlocNoteByUserIdUseCase.ts
import { Injectable } from '@nestjs/common';
import {BlocNote} from '@prisma/client';
import {ContextualGraphqlRequest, UseCase} from "../../../../index";
import BlocNotesRepository from "../../../Repository/BlocNotes/BlocNotesRepository";

@Injectable()
export default class UpsertBlocNoteUseCase implements UseCase<Promise<BlocNote>, [content: string]> {
    constructor(
        private readonly blocNoteRepository: BlocNotesRepository,
    ) {}

    async handle(context: ContextualGraphqlRequest, content: string): Promise<BlocNote> {
        return await this.blocNoteRepository.upsert(context.userId, content);
    }
}
