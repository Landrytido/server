import { Field, GraphQLISODateTime, Int, ObjectType } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';

@ObjectType()
export default class EventEntity {
  @Field(() => Int)
  id: number;

  @Field()
  source: string;

  @Field()
  type: string;

  @Field(() => GraphQLJSONObject)
  payload: Record<any, any>;

  @Field(() => GraphQLISODateTime)
  createdAt: string;
}
