import { Field, ObjectType } from "@nestjs/graphql";
import User from "../User";
import { LinkGroupLink } from "./LinkGroupLink";

@ObjectType()
export default class LinkGroup {
    @Field()
    id: string;

    @Field()
    title: string;

    @Field({ nullable: true })
    description?: string;

    // Owner of this LinkGroup.
    @Field(() => User)
    user: User;

    // Many-to-many relation to Link via LinkGroupLink.
    @Field(() => [LinkGroupLink])
    links: LinkGroupLink[];
}