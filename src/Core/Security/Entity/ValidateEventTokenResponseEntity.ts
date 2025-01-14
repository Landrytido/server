import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class ValidateEventTokenResponse {
  @Field(() => Boolean)
  isValid: boolean;

  @Field(() => Int, { nullable: true })
  eventId?: number;
}
