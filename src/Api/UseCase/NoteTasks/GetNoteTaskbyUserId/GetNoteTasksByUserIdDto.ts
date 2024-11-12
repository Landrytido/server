// src/Api/UseCase/NoteTasks/GetNoteTaskByUserId/GetNoteTasksByUserIdDto.ts

import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class GetNoteTasksByUserIdDto {
  @Field(() => Int)
  userId: number;

  @Field(() => Int)
  noteId: number; 

  @Field(() => Boolean, { nullable: true })
  completed?: boolean;
}
