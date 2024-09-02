import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export default class SaveUserDto {
  @Field(() => Int, { nullable: true })
  id?: number | null;

<<<<<<< HEAD
  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  firstName: string;
=======
    @Field({nullable : true})
    email?: string;

    @Field({nullable : true})
    password?: string;

    @Field({ nullable: true })
    firstName?: string;
>>>>>>> main

  @Field({ nullable: true })
  lastName?: string | null;
}
