import { Field, InputType } from "@nestjs/graphql";

@InputType()
export default class SaveTaskDto {
  @Field()
  title: string;
  @Field()
  description: string;
  @Field({nullable:true})
  dueDate?: Date;
  @Field()
  completed?: boolean;
}

