import {Field, InputType, Int} from "@nestjs/graphql";

@InputType()
export default class SaveUserDto {
    @Field(() => Int, { nullable: true })
    id?: number|null;

    @Field()
    email: string;

    @Field()
    password: string;

    @Field()
    firstName: string;

    @Field({ nullable: true })
    lastName?: string|null;
}
