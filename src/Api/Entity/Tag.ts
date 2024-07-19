import { Field, Int, ObjectType } from "@nestjs/graphql";
import Note from "./Note";

@ObjectType()
export default class Tag {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field(() => [Note])
  notes: Note[];
}
