import { HttpService } from "@nestjs/axios";
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import Task from "../../../Entity/Task";
import { lastValueFrom } from "rxjs";
import { ContextualGraphqlRequest, UseCase } from "src";
import TaskRepository from "src/Api/Repository/TaskRepository";
import UseCaseFactory from "../../UseCaseFactory";
import GetLoggedUserUseCase from "../../User/GetLoggedUser/GetLoggedUserUseCase";

@Injectable()
export default class GetTaskByUserIdUseCase
  implements UseCase<Promise<Task[]>, null>
{
  constructor(private readonly taskRepository: TaskRepository,
    private readonly httpService: HttpService,
    private readonly jwtService: JwtService,
    readonly configService: ConfigService,
    readonly serviceFactory: UseCaseFactory,
  ) {}

  async handle(context: ContextualGraphqlRequest) : Promise<Task[]>{
    try {
      const localTasks = await this.taskRepository.findByUserId(context.userId);

      const userContext= await (await this.serviceFactory.create(GetLoggedUserUseCase)).handle(
        context
      );

      const user = {
        id: userContext.id,
        email: userContext.email,
        password: null,
        firstName: userContext.firstName,
        lastName: userContext.lastName,
        createdAt: userContext.createdAt,
        updatedAt: userContext.updatedAt
      }

      // TIO OR TASKS
      let externalTasks : Task[]  =[];
      try{
        const externalTasksResult =(await this.fetchExternalTasks(context.email) as any);
       externalTasks = (externalTasksResult || []).map(task=>({
        id: task.id,
        title: task.name,
        description: task.description || '',
        dueDate: new Date(task.updatedAt) ,
        completed: task.status === 'DONE',
        userId: context.userId,
        noteId: -1,
        user
      }));
    } catch (error) {

    }

      return  [...localTasks.map(localTask=>({...localTask , user})), ...externalTasks] ;
    } catch (error) {
      throw new BadRequestException(
        "GetTaskByUserIdUseCaseFailed",
        error.message
      );
    }
  }

  private async fetchExternalTasks(email: string): Promise<Task[]> {
    const urlTIO =  this.configService.get('TIO_URL_GRAPHQL');
    const secret = this.configService.get('JWT_SECRET_TIO');

    if(!urlTIO || !secret){
      return [];
    }

    const query = `
        query worksByOwnerMail {
            worksByOwnerMail {
                id
                name
                description
                status
                rate
                updatedAt
            }
        }
    `;

    const variables = {};

    try {
        const response = await lastValueFrom(
            this.httpService.post(
              urlTIO,
                {
                    // operationName,
                    query,
                    variables,
                },
                {
                    headers: {
                        Authorization: `Bearer ${this.getAuthToken(email, secret)}`,
                        'Content-Type': 'application/json',
                    },
                }
            ),
        );

        // Handling the response
        if (response.data && response.data.data) {
            return response.data.data.worksByOwnerMail; // Return the works from the response
        }

    } catch (error) {
        console.error("Error retrieving external tasks:", error.message);
        if (error.response) {
            console.error("Error details:", error.response.data);
        }
    }
}

private getAuthToken(email: string, secret: string): string {
      const payload = {
          email,
          permissions: ['READ:TASKS'],
          exp: Math.floor(Date.now() / 1000) + 60 , // Expiration dans 1 minute
        };

        return this.jwtService.sign(payload, { secret });
    }

}
