import { Field, GraphQLISODateTime, Int, ObjectType } from "@nestjs/graphql";
import {ContextualGraphqlRequest} from "../../../index";

@ObjectType()
export default class FileEntity {
  @Field(() => Int)
  id: number;

  @Field()
  uri: string;

  @Field()
  initialFilename: string;

  @Field()
  filename: string;

  @Field()
  path: string;

  @Field(() => GraphQLISODateTime)
  createdAt: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt: Date;

  context? : ContextualGraphqlRequest;
}
