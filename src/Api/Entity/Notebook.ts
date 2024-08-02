import { Field, Int, ObjectType } from '@nestjs/graphql';
import User from './User';
import { Note } from './Note';

@ObjectType()
export class Notebook {
    @Field(() => Int)
    id: number;

    @Field()
    title: string;

    @Field(() => Int)
    userId: number;

    @Field(() => User)
    user?: User;

    @Field(() => [Note])
    notes?: Note[];
}
