import { InputType, Field, Int } from '@nestjs/graphql';
import { IsString, IsOptional, IsInt, IsUrl } from 'class-validator';

@InputType()
export class UpdateLinkDto {
    @Field()
    name: string;

    @Field({ nullable: true })
    url?: string;

    @Field({ nullable: true })
    description?: string;

    @Field(() => Int, { nullable: true })
    userId?: number;
}