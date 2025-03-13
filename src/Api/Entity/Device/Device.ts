import { ObjectType, Field, Int } from "@nestjs/graphql";
import { Platform } from "@prisma/client";
import User from "../User";

@ObjectType()
export default class Device {

    @Field(() => Int)
    id: number;

    @Field()
    token: string;

    @Field({ defaultValue: Platform.WEB })
    platform: Platform;

    @Field(() => Int)
    userId: number;

    @Field(() => User)
    user: User;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
}
