import {IsInt, IsNotEmpty, IsOptional, IsString} from "class-validator";
import {Field, InputType, Int} from "@nestjs/graphql";

@InputType()
export class CreateLinkGroupDto {
    @Field()
    @IsNotEmpty()
    @IsString()
    name: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    description: string;

    @Field(() => Int)
    @IsNotEmpty()
    @IsInt()
    userId: number;
}