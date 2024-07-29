import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Meet } from "../Entity/Meet";
import CreateMeetUseCase from "../UseCase/Meet/CreateMeetUseCase";
import MeetDto from "../UseCase/Meet/MeetDto";
import UpdateMeetUseCase from "../UseCase/Meet/UpdateMeetUseCase";
import GetMeetUseCase from "../UseCase/Meet/GetMeetUseCase";
import DeleteMeetUseCase from "../UseCase/Meet/DeleteMeetUseCase";
import GetAllMeetUseCase from "../UseCase/Meet/GetAllMeetUseCase";

@Resolver(Meet)
export default class MeetResolver {
    constructor(
        private readonly createMeetUseCase: CreateMeetUseCase,
        private readonly updateMeetUseCase: UpdateMeetUseCase,
        private readonly getMeetUseCase : GetMeetUseCase,
        private readonly deleteMeetUseCase : DeleteMeetUseCase,
        private readonly getAllMeetUseCase : GetAllMeetUseCase

    ) {}

    @Mutation(() => Meet)
    async createMeet(@Args('meetDto') meetDto: MeetDto): Promise<Meet> {
        return await this.createMeetUseCase.handle(meetDto);
    }


    @Mutation(()=> Meet)
    async updateMeet(@Args('id') id:number, @Args('meetDto') meetdto : MeetDto):Promise<Meet>{
        return await this.updateMeetUseCase.handle(id, meetdto);
    }
    @Query(() => Meet)
    async getMeet(@Args('id') id: number): Promise<Meet> {
        return await this.getMeetUseCase.handle(id);
    }

    @Query(() => [Meet])
    async getAllMeet(): Promise<Meet[]> {
        return await this.getAllMeetUseCase.handle();
    }

    @Mutation(() => Meet)
    async deleteMeet(@Args('id') id: number): Promise<Meet> {
        return await this.deleteMeetUseCase.handle(id);
    }
}