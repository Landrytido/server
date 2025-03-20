import { Field, GraphQLISODateTime, Int, ObjectType } from "@nestjs/graphql";
import User from "./User";
import { ContextualGraphqlRequest } from "src";

@ObjectType()
export default class BlocNote {
    @Field(() => Int)
    id: number;

    @Field(() => String, { nullable: true })
    content?: string;

    @Field(() => GraphQLISODateTime, { nullable: true })
    createdAt?: Date;

    @Field(() => GraphQLISODateTime, { nullable: true })
    updatedAt?: Date;

    @Field(() => Int)
    userId: number;

    @Field(() => User, { nullable: true })
    user?: User;

    context?: ContextualGraphqlRequest;
}
