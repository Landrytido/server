// reminder.processor.ts
import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { PrismaService } from 'src/Core/Datasource/Prisma';
import { Injectable } from '@nestjs/common';

@Processor('reminder-queue')  
@Injectable()
export class ReminderProcessor {
  constructor(private readonly prisma: PrismaService) {}

  @Process() 
  async sendReminder(job: Job) {
    const { userId, instructionId, reminderTime } = job.data;
    
    const instruction = await this.prisma.autoInstruction.findUnique({
      where: { id: instructionId },
    });

    if (!instruction) {
      console.error('Instruction not found');
      return;
    }
  }
}
