import { InputType, Field, Int } from '@nestjs/graphql';
import { IsInt, IsOptional, IsString, IsBoolean } from 'class-validator';

@InputType()
export class UpdateNoteTaskDto {
  @Field(() => Int)
  @IsInt()
  id: number;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  title?: string;

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  completed?: boolean;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  parentId?: number | null;
}
