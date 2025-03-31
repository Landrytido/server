import { ObjectType, Field, GraphQLISODateTime } from '@nestjs/graphql';

@ObjectType()
export class Label {
  @Field()
  id: string;

  @Field()
  name: string;
  
  @Field(() => GraphQLISODateTime, { nullable: true })
  createdAt?: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  updatedAt?: Date;
}
