import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import User from './User';
import { Note } from './Note';

@ObjectType()
export class NoteCollaboration {
    @Field(() => Int)
    id: number;

    @Field(() => PermissionLevel)
    permissionLevel: PermissionLevel;

    @Field(() => Int)
    noteId: number;

    @Field(() => Int)
    userId: number;

    @Field(() => Note)
    note: Note;

    @Field(() => User)
    user: User;
}

export enum PermissionLevel {
    READ = 'READ',
    WRITE = 'WRITE',
    ADMIN = 'ADMIN',
}

registerEnumType(PermissionLevel, {
    name: 'PermissionLevel',
    description: 'The permission levels for note collaboration',
});
