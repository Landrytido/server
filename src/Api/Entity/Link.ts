import { Field, Int, ObjectType } from '@nestjs/graphql';
import User from './User';
import { LinkGroup } from './LinkGroup';

@ObjectType()
export class Link {
    @Field(() => Int)
    id: number;

    @Field()
    name: string;

    @Field()
    url: string;

    @Field({ nullable: true })
    description?: string;

    @Field(() => Int)
    linkGroupId: number;

    @Field(() => Int)
    userId: number;

    @Field(() => LinkGroup, { nullable: true })
    linkGroup?: LinkGroup;

    @Field(() => User, { nullable: true })
    user?: User;
}
