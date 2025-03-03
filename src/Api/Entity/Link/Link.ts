// src/Api/Entity/Link.ts
import User from "../User";
import {Field, GraphQLISODateTime, ObjectType} from "@nestjs/graphql";
import {LinkGroupLink} from "./LinkGroupLink";
import {File} from "../File";

@ObjectType()
export default class Link {
    @Field()
    id: string;

    @Field()
    url: string;

    // Optional relation to the owner.
    @Field(() => User, { nullable: true })
    owner?: User;

    // Optional relation to an image file.
    @Field(() => File, { nullable: true })
    image?: File;

    @Field(() => GraphQLISODateTime, { nullable: true })
    screenShotAt?: Date;

    // Many-to-many relation to LinkGroup via LinkGroupLink.
    @Field(() => [LinkGroupLink])
    groups: LinkGroupLink[];
}