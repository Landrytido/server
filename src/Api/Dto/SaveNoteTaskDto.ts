import { InputType, Field, Int } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsString, IsBoolean, IsOptional } from 'class-validator';

@InputType()
export class SaveNoteTaskDto {
  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  id?: number | null;
  
  @Field()
  @IsString()
  @IsNotEmpty()
  title: string;

  @Field(() => Boolean, { nullable: true }) 
  @IsBoolean()
  @IsOptional()
  completed?: boolean;

  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  noteId: number;

  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  parentId?: number | null;
  
}
