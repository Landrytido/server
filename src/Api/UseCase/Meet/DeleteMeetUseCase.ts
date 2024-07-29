import { Injectable, NotFoundException } from "@nestjs/common";
import MeetRepository from "src/Api/Repository/MeetRepository";
import { Meet } from "@prisma/client";

@Injectable()
export default class DeleteMeetUseCase {
    constructor(private readonly meetRepository: MeetRepository) {}

    async handle(id: number): Promise<Meet> {
        const meet = await this.meetRepository.findById(id);

        if (!meet) {
            throw new NotFoundException('Réunion non trouvée');
        }
        await this.meetRepository.delete(id)
        return meet;
    }
}
