import { Field, Int, ObjectType } from '@nestjs/graphql';
import User from './User';
import { Event } from './Event';

@ObjectType()
export class MeetSharedWithMember {
    @Field(() => Int)
    meetId: number;

    @Field(() => Int)
    userId: number;

    @Field(() => Event)
    meet: Event;

    @Field(() => User)
    user: User;
}
