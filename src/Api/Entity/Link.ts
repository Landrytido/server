import { Field, Int, ObjectType } from '@nestjs/graphql';
import User from './User';
import { LinkGroup } from './LinkGroup';

@ObjectType()
export class Link {
    @Field(() => Int)
    id: number;

    @Field()
    url: string;

    @Field()
    description?: string;

    @Field(() => Int)
    linkGroupId: number;

    @Field(() => Int)
    userId: number;

    @Field(() => LinkGroup)
    linkGroup: LinkGroup;

    @Field(() => User)
    user: User;
}
