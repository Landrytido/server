import { Field, GraphQLISODateTime, Int, ObjectType } from "@nestjs/graphql";
import Link from "./Link";


@ObjectType()
export class File {
    @Field(() => Int)
    id: number;

    @Field()
    filename: string;

    @Field()
    initialFilename: string;

    @Field()
    path: string;

    @Field()
    uri: string;

    @Field(() => [Link])
    linkImage: Link[];

    @Field(() => GraphQLISODateTime)
    createdAt: Date;

    @Field(() => GraphQLISODateTime)
    updatedAt: Date;
}
