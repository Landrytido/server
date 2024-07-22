import {Field, InputType, Int} from "@nestjs/graphql";
import {IsInt, IsNotEmpty, IsString, IsUrl} from "class-validator";

@InputType()
export class CreateLinkDto {

    @Field()
    @IsString()
    @IsNotEmpty()
    name: string;

    @Field()
    @IsString()
    @IsNotEmpty()
    @IsUrl()
    url: string;

    @Field()
    @IsString()
    @IsNotEmpty()
    description: string;

    @Field(() => Int)
    @IsInt()
    linkGroupId: number;

    @Field(() => Int, { nullable: true })
    @IsInt()
    userId?: number;
}