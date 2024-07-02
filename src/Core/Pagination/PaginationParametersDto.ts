import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
class OrderByDto {
  @Field()
  key: string;

  @Field()
  type: 'asc' | 'desc' = 'desc';
}

@InputType()
export default class PaginationParametersDto {
  @Field(() => Int, { nullable: true })
  size?: number;

  @Field(() => Int, { nullable: true })
  from?: number;

  @Field(() => OrderByDto, { nullable: true })
  orderBy?: OrderByDto[];
}
