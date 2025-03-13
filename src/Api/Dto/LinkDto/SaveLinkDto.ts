import {InputType, Field} from "@nestjs/graphql";

@InputType()
export class SaveLinkDto {
    @Field()
    linkGroupId: string;

    @Field()
    linkName: string;

    @Field({nullable: true})
    id?: string;

    @Field()
    url: string;

    @Field({nullable: true})
    ownerId?: number;

    @Field({nullable: true})
    imageId?: number;

    @Field({nullable: true})
    screenShotAt?: Date;
}