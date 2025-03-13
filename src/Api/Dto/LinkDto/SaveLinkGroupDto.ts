import {InputType, Field} from "@nestjs/graphql";

@InputType()
export class SaveLinkGroupDto {
    @Field({nullable: true})
    id?: string;

    @Field()
    title: string;

    @Field({nullable: true})
    description?: string;
}