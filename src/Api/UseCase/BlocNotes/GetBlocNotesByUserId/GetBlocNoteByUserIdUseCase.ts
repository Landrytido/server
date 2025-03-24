// src/Api/UseCase/BlocNotes/GetBlocNotesByUserId/GetBlocNoteByUserIdUseCase.ts
import { Injectable } from '@nestjs/common';
import {BlocNote} from '@prisma/client';
import {ContextualGraphqlRequest, UseCase} from "../../../../index";
import BlocNotesRepository from "../../../Repository/BlocNotes/BlocNotesRepository";

@Injectable()
export default class GetBlocNoteByUserIdUseCase implements UseCase<Promise<BlocNote>, []> {
    constructor(
        private readonly blocNoteRepository: BlocNotesRepository,
    ) {}

    async handle(context: ContextualGraphqlRequest): Promise<BlocNote> {
        return await this.blocNoteRepository.findByUserId(context.userId);
    }
}
