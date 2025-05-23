import { Field, Int, ObjectType } from "@nestjs/graphql";
import User from "./User";

@ObjectType()
export class Relation {
  @Field(() => Int)
  invitationId: number;

  @Field(() => String)
  friendEmail: string;

  @Field(() => String)
  friendFirstName: string;

  @Field(() => String)
  friendLastName: string;

  @Field(() => User)
  receiver: User;

  @Field(() => User)
  sender: User;
}
