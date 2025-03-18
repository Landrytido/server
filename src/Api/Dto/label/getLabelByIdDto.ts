import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class GetLabelByIdInput {
  @Field(() => ID, { description: "ID du label à récupérer" })
  id: string;
}