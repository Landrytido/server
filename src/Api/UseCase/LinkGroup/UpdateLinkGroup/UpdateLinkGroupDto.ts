import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export default class UpdateLinkGroupDto {
    @Field()
    name: string;

    @Field({ nullable: true })
    description: string;

    @Field(() => Int)
    userId: number;
}