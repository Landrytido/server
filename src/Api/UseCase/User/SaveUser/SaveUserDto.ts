import {Field, InputType, Int} from "@nestjs/graphql";

@InputType()
export default class SaveUserDto {
    @Field(() => Int, { nullable: true })
    id?: number|null;

    @Field({nullable : true})
    email?: string;

    @Field({nullable : true})
    password?: string;

    @Field({ nullable: true })
    firstName?: string;

    @Field({ nullable: true })
    lastName?: string|null;
}
