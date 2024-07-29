import { Injectable, NotFoundException } from "@nestjs/common";
import MeetRepository from "src/Api/Repository/MeetRepository";
import MeetDto from "./MeetDto";
import { Meet } from "@prisma/client";

@Injectable()
export default class UpdateMeetUseCase {
  constructor(private readonly meetRepository: MeetRepository) {}

  async handle(id: number, dto: MeetDto): Promise<Meet> {
    const meet = await this.meetRepository.findById(id);

    if (!meet) {
      throw new NotFoundException('Réunion non trouvée');
    }

    return this.meetRepository.update(id, {
      title: dto.title,
      description: dto.description,
      startDate: dto.startDate,
      endDate: dto.endDate,
      location: 'Virtual',                
      user: {
        connect: {
          id: 1, 
        },
      },
    });
  }
}
