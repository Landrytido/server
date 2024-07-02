import { Field, Int, ObjectType } from '@nestjs/graphql';
import User from './User';
import { Note } from './Note';

@ObjectType()
export class Comment {
    @Field(() => Int)
    id: number;

    @Field()
    content: string;

    @Field()
    createdAt: Date;

    @Field(() => Int)
    userId: number;

    @Field(() => Int)
    noteId: number;

    @Field(() => User)
    user: User;

    @Field(() => Note)
    note: Note;
}
