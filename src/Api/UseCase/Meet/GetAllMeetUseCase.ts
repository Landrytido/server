import { Injectable, NotFoundException } from "@nestjs/common";
import MeetRepository from "src/Api/Repository/MeetRepository";
import { Meet } from "@prisma/client";

@Injectable()
export default class GetAllMeetUseCase {
    constructor(private readonly meetRepository: MeetRepository) {}

    async handle(): Promise<Meet[]> {
        const meets = await this.meetRepository.findAll();

        if (!meets || meets.length === 0) {
            throw new NotFoundException('Réunions non trouvées');
        }

        return meets;
    }
}
