import { Field, InputType, Int, } from '@nestjs/graphql';
import User from 'src/Api/Entity/User';


@InputType()
export default class MeetDto {

    @Field()
    title: string;

    @Field()
    description: string;

    @Field()
    startDate: Date;

    @Field()
    endDate?: Date;

}