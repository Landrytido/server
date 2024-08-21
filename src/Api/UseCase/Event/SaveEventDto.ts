import { Field, GraphQLISODateTime, InputType, Int, } from '@nestjs/graphql';
import User from 'src/Api/Entity/User';
@InputType()
export default class EventDto {

    @Field(() => Int, { nullable: true })
    id?: number|null;

    @Field()
    title: string;

    @Field()
    description: string;

    @Field(() => GraphQLISODateTime)
    startDate: Date;

    @Field(() => GraphQLISODateTime)
    endDate: Date;

    @Field()
    location: string;

    @Field(() => Int)
    userId: number;
}