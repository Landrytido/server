import { Field, GraphQLISODateTime, Int, ObjectType } from '@nestjs/graphql';
import { ContextualGraphqlRequest } from '../../index';

@ObjectType()
export default class User {
  @Field(() => Int)
  id: number;

  @Field()
  email: string;

  password: string;

  @Field()
  firstName: String;

  @Field()
  lastName: String;

  @Field(() => GraphQLISODateTime)
  createdAt: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt: Date;

  context?: ContextualGraphqlRequest;
}
