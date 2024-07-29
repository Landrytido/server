import { Injectable } from '@nestjs/common';
import { Meet } from '@prisma/client';
import MeetDto from './MeetDto';
import MeetRepository from 'src/Api/Repository/MeetRepository';

@Injectable()
export default class CreateMeetUseCase {
  constructor(private readonly meetRepository: MeetRepository) {}

  async handle(dto: MeetDto): Promise<Meet> {
    return this.meetRepository.create({
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
