import { GraphQLString } from "graphql";

import { Field, InputType, Int } from "@nestjs/graphql";

import { InvitationStatus } from "@prisma/client";

@InputType()
export default class CreateCalendarEventInvitationDto {
  @Field(() => Int)
  senderId: number;

  @Field(() => String, { nullable: true })
  receiverEmail: string;

  @Field(() => Int)
  calendarEventId: number;
}
