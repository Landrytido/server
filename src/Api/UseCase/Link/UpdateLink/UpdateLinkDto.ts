import { InputType, Field, Int } from '@nestjs/graphql';
import { IsString, IsOptional, IsInt, IsUrl } from 'class-validator';

@InputType()
export class UpdateLinkDto {
    @Field()
    @IsString()
    @IsUrl()
    name: string;

    @Field({ nullable: true })
    @IsString()
    @IsUrl()
    url?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    description?: string;

    @Field(() => Int, { nullable: true })
    @IsInt()
    userId?: number;
}