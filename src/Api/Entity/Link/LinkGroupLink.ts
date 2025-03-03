
import { ObjectType, Field, Int } from "@nestjs/graphql";
import LinkGroup from "./LinkGroup";
import Link from "./Link";

@ObjectType()
export class LinkGroupLink {
    @Field()
    linkGroupId: string;

    @Field()
    linkId: string;

    @Field()
    linkName: string;

    @Field(() => Int)
    clickCounter: number;

    @Field(() => LinkGroup)
    linkGroup: LinkGroup;

    @Field(() => Link)
    link: Link;
}