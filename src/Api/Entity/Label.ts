import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class Label {
  @Field()
  id: string;

  @Field()
  name: string;
}
