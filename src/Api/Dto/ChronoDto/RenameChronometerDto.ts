import { InputType, Field } from "@nestjs/graphql";

@InputType()
export class RenameChronometerDto {
  @Field()
  id: string;

  @Field()
  newName: string;
}