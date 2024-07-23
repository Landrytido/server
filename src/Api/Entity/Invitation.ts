import { Field, Int, ObjectType } from '@nestjs/graphql';
import User from './User';

@ObjectType()
export class Invitation {
    @Field(() => Int)
    id: number;

    @Field(() => Int)
    receiverId: number;

    @Field(() => Int)
    senderId: number;

    @Field(() => User)
    receiver: User;

    @Field(() => User)
    sender: User;
}
