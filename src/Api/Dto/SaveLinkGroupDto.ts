import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export default class SaveLinkGroupDto {
    @Field()
    name: string;

    @Field({ nullable: true })
    description?: string;

    @Field(() => Int)
    userId: number;
}