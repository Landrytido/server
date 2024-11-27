import { ObjectType, Field, Int } from '@nestjs/graphql';
import User from './User'; 
import Note from './Note';  

@ObjectType()
export default class NoteTask {
  @Field(() => Int)
  id: number;

  @Field()
  title: string;

  @Field()
  completed: boolean;

  @Field(() => Int)
  noteId: number;

  @Field(() => Int)
  userId: number;

  @Field(() => Int, { nullable: true })
  parentId?: number;

  @Field(() => User)  
  user: User;

  @Field(() => Note) 
  note: Note;

  @Field(() => NoteTask, { nullable: true })
  parent?: NoteTask;

  @Field(() => [NoteTask], { nullable: true })
  subtasks?: NoteTask[] | null;
}
