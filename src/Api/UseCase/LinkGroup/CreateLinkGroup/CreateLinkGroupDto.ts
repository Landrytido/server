import { Field, InputType } from "@nestjs/graphql";

@InputType()
export default class CreateLinkGroupDto {
    @Field()
    name: string;

    @Field({ nullable: true })
    description?: string;
}