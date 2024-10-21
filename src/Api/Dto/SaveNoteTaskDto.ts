import { InputType, Field, Int } from '@nestjs/graphql';


@InputType()
export class SaveNoteTaskDto {
  @Field(() => Int, { nullable: true })
  id?: number | null;
  
  @Field({ nullable: true })
  title?: string;

  @Field(() => Int)
  noteId?: number;

  @Field()
  completed?: boolean;

  @Field(() => Int)
  userId: number;
}
