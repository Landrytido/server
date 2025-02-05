import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class ValidateEventTokenResponse {
  @Field(() => Boolean)
  isValid: boolean;

  //a supp si tout ok
  // @Field(() => Int, { nullable: true })
  // eventId?: number;
  //asupp

  @Field(() => Int, { nullable: true })
  entityId: number;

  @Field({ nullable: true })
  entityType: string;

  @Field(() => Int, { nullable: true })
  userId: number;
}
