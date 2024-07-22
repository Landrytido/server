import {InputType, Field, Int} from '@nestjs/graphql';
import {IsString, IsOptional, IsNotEmpty, IsInt} from 'class-validator';

@InputType()
export class UpdateLinkGroupDto {
    @Field()
    @IsString()
    @IsNotEmpty()
    name: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    description: string;

    @Field(() => Int, { nullable: true })
    @IsInt()
    userId?: number;

}