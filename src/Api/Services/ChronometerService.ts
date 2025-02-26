import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../Core/Datasource/Prisma';
import { Chronometer } from '@prisma/client';

@Injectable()
export class ChronometerService {
  constructor(private prisma: PrismaService) {}

  async start(userId: number, name: string, mode: 'countdown' | 'stopwatch', duration?: number): Promise<Chronometer> {
  
    const userExists = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      throw new NotFoundException('Utilisateur non trouvé.');
    }

    if (mode === 'countdown') {
      const existingCountdown = await this.prisma.chronometer.findFirst({
        where: { userId, mode: 'countdown', isRunning: true },
      });
      if (existingCountdown) {
        throw new BadRequestException('Un compte à rebours est déjà en cours pour cet utilisateur.');
      }
      if (duration === undefined || duration <= 0) {
        throw new BadRequestException('La durée du compte à rebours doit être positive.');
      }
    }

    return this.prisma.chronometer.create({
      data: {
        userId,
        name,
        mode,
        startTime: new Date(),
        isRunning: true,
        duration: mode === 'countdown' ? duration : null,
        elapsedTime: 0,
      },
    });
  }

  async stop(userId: number, id: string): Promise<Chronometer> {
    const chrono = await this.prisma.chronometer.findFirst({
      where: { userId, id, isRunning: true },
    });

    if (!chrono) {
      throw new NotFoundException('Aucun chronomètre en cours pour cet utilisateur.');
    }

  
    const elapsedTime = chrono.elapsedTime + 
      Math.floor((new Date().getTime() - chrono.startTime.getTime()) / 1000);

    return this.prisma.chronometer.update({
      where: { id: chrono.id },
      data: {
        isRunning: false,
        elapsedTime,
      },
    });
  }

  async pause(userId: number, id: string): Promise<Chronometer> {
    const chrono = await this.prisma.chronometer.findFirst({
      where: { userId, id, isRunning: true },
    });

    if (!chrono) {
      throw new NotFoundException('Aucun chronomètre en cours pour cet utilisateur.');
    }


    const elapsedTime = chrono.elapsedTime + 
      Math.floor((new Date().getTime() - chrono.startTime.getTime()) / 1000);

    return this.prisma.chronometer.update({
      where: { id: chrono.id },
      data: {
        isRunning: false,
        elapsedTime,
      },
    });
  }

  async resume(userId: number, id: string): Promise<Chronometer> {
    const chrono = await this.prisma.chronometer.findFirst({
      where: { userId, id, isRunning: false },
    });

    if (!chrono) {
      throw new NotFoundException('Aucun chronomètre en pause trouvé.');
    }

    return this.prisma.chronometer.update({
      where: { id: chrono.id },
      data: {
        startTime: new Date(),
        isRunning: true,
      },
    });
  }

  async reset(userId: number, id: string): Promise<Chronometer> {
    const chrono = await this.prisma.chronometer.findFirst({
      where: { userId, id },
    });

    if (!chrono) {
      throw new NotFoundException('Aucun chronomètre trouvé pour cet utilisateur.');
    }

    return this.prisma.chronometer.update({
      where: { id: chrono.id },
      data: {
        startTime: null,
        isRunning: false,
        elapsedTime: 0,
      },
    });
  }

  async delete(userId: number, id: string): Promise<Chronometer> {
    const chrono = await this.prisma.chronometer.findFirst({
      where: { userId, id },
    });

    if (!chrono) {
      throw new NotFoundException('Aucun chronomètre trouvé pour cet utilisateur.');
    }

    return this.prisma.chronometer.delete({
      where: { id: chrono.id },
    });
  }

  async getChronometer(userId: number, id: string): Promise<Chronometer | null> {
    return this.prisma.chronometer.findFirst({
      where: { userId, id },
    });
  }

  async getAllChronometers(userId: number): Promise<Chronometer[]> {
    return this.prisma.chronometer.findMany({
      where: { userId, mode: 'stopwatch' },
    });
  }

  async getCountdown(userId: number): Promise<Chronometer | null> {
    return this.prisma.chronometer.findFirst({
      where: { userId, mode: 'countdown' },
      orderBy: { startTime: 'desc' },
    });
  }

  async isCountdownFinished(chronoId: string): Promise<boolean> {
    const chrono = await this.prisma.chronometer.findUnique({
      where: { id: chronoId },
    });
    
    if (!chrono || chrono.mode !== 'countdown' || !chrono.isRunning || !chrono.startTime || !chrono.duration) {
      return false;
    }
    
    const elapsedSeconds = chrono.elapsedTime + 
      Math.floor((new Date().getTime() - chrono.startTime.getTime()) / 1000);
    
    return elapsedSeconds >= chrono.duration;
  }

  async getCurrentTime(chronoId: string): Promise<number> {
    const chrono = await this.prisma.chronometer.findUnique({
      where: { id: chronoId },
    });
    
    if (!chrono) {
      throw new NotFoundException('Chronomètre non trouvé.');
    }
    
    if (!chrono.isRunning) {
      return chrono.elapsedTime;
    }
    

    const currentTime = chrono.elapsedTime + 
      Math.floor((new Date().getTime() - chrono.startTime.getTime()) / 1000);
    

    if (chrono.mode === 'countdown' && chrono.duration) {
      const remainingTime = Math.max(0, chrono.duration - currentTime);
      return remainingTime;
    }
    

    return currentTime;
  }
}