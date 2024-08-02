import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class CreateLinkDto {

    @Field()
    name: string;

    @Field()
    url: string;

    @Field({ nullable: true })
    description?: string;

    @Field(() => Int)
    linkGroupId: number;

    @Field(() => Int, { nullable: true })
    userId?: number;
}