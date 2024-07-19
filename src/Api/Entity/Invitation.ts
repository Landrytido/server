import { Field, Int, ObjectType } from "@nestjs/graphql";
import User from "./User";

@ObjectType()
export default class Invitation {
  @Field(() => Int)
  idPrimary: number;

  @Field(() => Int)
  receiverId: number;

  @Field(() => Int)
  senderId: number;

  @Field(() => User)
  receiver: User;

  @Field(() => User)
  sender: User;
}
