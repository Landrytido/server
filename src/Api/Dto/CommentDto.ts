import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export default class CommentDto 
 {
  @Field()
  content: string;

  @Field(() => Int)
  noteId: number; 
  
  @Field(() => Int)
  userId: number;
 
}
