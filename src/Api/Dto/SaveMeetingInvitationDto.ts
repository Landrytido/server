import { Field, GraphQLISODateTime, InputType, Int } from "@nestjs/graphql";
import { InvitationStatus } from "@prisma/client";
import { GraphQLString } from "graphql";
import { ContextualGraphqlRequest } from "src";

@InputType()
export default class SaveMeetingInvitationDto {
  @Field(() => Int, { nullable: true })
  id?: number | null;

  @Field(() => Int)
  senderId: number;

  @Field(() => Int)
  receiverId: number;

  @Field(() => Int)
  meetingId: number;

  @Field(() => [GraphQLString], { nullable: true })
  invitedEmails?: string[];

  @Field(() => String, { nullable: true })
  status?: InvitationStatus;

  @Field(() => GraphQLISODateTime, { nullable: true })
  updatedAt?: Date;

  context?: ContextualGraphqlRequest;
}
