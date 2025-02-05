import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayInit,
  WsResponse,
  WsException,
} from '@nestjs/websockets';
import { PrismaService } from 'src/Core/Datasource/Prisma';


@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class AutoInstructionGateway implements OnGatewayInit {
  constructor(private readonly prisma: PrismaService) {}

  afterInit() {
    console.log('WebSocket Gateway Initialized');
  }

  @SubscribeMessage('getInstructions')
  async getInstructions(@MessageBody() userId: number): Promise<WsResponse<any>> {
    try {
      if (!userId) {
        throw new WsException('User ID is required.');
      }
  
      // Fetch the user's last login date
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });
  
      if (!user) {
        throw new WsException('User not found.');
      }
  

      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
  
      const lastLoginDate = new Date(user.lastLoginDate);
      lastLoginDate.setHours(0, 0, 0, 0);
  
     /*//Check if the user is logging in for the first time today
     if (lastLoginDate.getTime() === currentDate.getTime()) {
        return { event: 'sendInstructions', data: [] };
      }*/
  
      await this.prisma.user.update({
        where: { id: userId },
        data: { lastLoginDate: new Date() },
      });
  
      const instructions = await this.prisma.autoInstruction.findMany({
        where: { userId },
        orderBy: { order: 'asc' },
      });
  
      if (instructions.length === 0) {
        throw new WsException('No instructions available.');
      }
  
      return { event: 'sendInstructions', data: instructions };
    } catch (error) {
      console.error('Error getting instructions:', error);
      throw new WsException('Failed to get instructions');
    }
  }
  
  @SubscribeMessage('nextInstruction')
  async nextInstruction(@MessageBody() { userId, currentOrder }: { userId: number; currentOrder: number }) {
    try {
      if (!userId || currentOrder === undefined) {
        throw new WsException('Invalid userId or currentOrder.');
      }
  
      // Fetch the next instruction
      const nextInstruction = await this.prisma.autoInstruction.findFirst({
        where: {
          userId,
          order: currentOrder + 1,
        },
      });
  
      if (!nextInstruction) {
        // If no next instruction, notify that it's the last instruction
        return {
          event: 'noMoreInstructions',
          data: 'No more instructions to display.',
        };
      }
  
      // Otherwise, send the next instruction
      return {
        event: 'nextInstruction',
        data: nextInstruction,
      };
    } catch (error) {
      console.error('Error fetching next instruction:', error);
      throw new WsException('Failed to fetch next instruction');
    }
  }
  
}



