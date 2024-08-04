import { Field, Int, ObjectType, registerEnumType} from '@nestjs/graphql';
import User from './User';
import { MeetSharedWithMember } from './MeetSharedWithMember';
import { ContextualGraphqlRequest } from "../../index";
import { Recurrence } from "src/main";

@ObjectType()
export class Meet {
    @Field(() => Int)
    id: number;

    @Field()
    title: string;

    @Field()
    description: string;

    @Field()
    startDate: Date;

    @Field()
    endDate: Date;

    @Field()
    isRecurring: boolean;

    @Field(() => Recurrence)
    recurrence: Recurrence;

    @Field()
    location: string;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;

    @Field(() => Int)
    userId: number;

    @Field(() => User)
    user: User;

    @Field(() => [MeetSharedWithMember])
    sharedWith: MeetSharedWithMember[];

    context?: ContextualGraphqlRequest;
}



