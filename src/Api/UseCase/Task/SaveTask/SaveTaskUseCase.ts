import { ForbiddenException, Inject, Injectable } from "@nestjs/common";
import { Task } from "@prisma/client";
import { ContextualGraphqlRequest, UseCase } from "src";
import SaveTaskDto from "src/Api/Dto/SaveTaskDto";
import TaskRepository from "src/Api/Repository/TaskRepository";
import Authenticator from "src/Core/Security/Service/authentication/Authenticator";

@Injectable()
export default class SaveTaskUseCase
  implements UseCase<Promise<Task>, [dto: SaveTaskDto]>
{
  constructor(
    private readonly taskRepository: TaskRepository,
    @Inject("Authenticator") private authenticator: Authenticator
  ) {}

  async handle(
    context: ContextualGraphqlRequest,
    dto: SaveTaskDto
  ): Promise<Task> {
    try {
      const userId = context.userId;

      if (dto.id && userId !== dto.userId) {
        throw new ForbiddenException("Not authorized");
      }

      dto.userId = userId;

      const prismaData: any = { ...dto };

      if (dto.notificationPreferenceId) {
        // const userData = await this.userRepository.findById(userId);
        // const email = userData.email; a remeetre sil faut

        const email = context.email;

        // Génération d'un token avec les informations du user
        const token = await this.authenticator.createToken({ userId, email });
        prismaData.token = token;
      }

      const task = await this.taskRepository.save(prismaData);

      return task;
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }
}
