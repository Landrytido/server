import { Field, GraphQLISODateTime, Int, ObjectType } from '@nestjs/graphql';
import { ContextualGraphqlRequest } from '../../index';
import {Session} from "./Session";
import {Note} from "./Note";
import {Notebook} from "./Notebook";
import {LinkGroup} from "./LinkGroup";
import {Link} from "./Link";
import {Task} from "./Task";
import {NoteCollaboration} from "./NoteCollaboration";
import {Invitation} from "./Invitation";
import {Meet} from "./Meet";
import {MeetSharedWithMember} from "./MeetSharedWithMember";
import {ResetToken} from "./ResetToken";
import {Comment} from "./Comment";

@ObjectType()
export default class User {
  @Field(() => Int)
  id: number;

  @Field()
  email: string;

  password: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field(() => GraphQLISODateTime)
  createdAt: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt: Date;

  @Field(() => [Session], { nullable: true })
  sessions?: Session[];

  @Field(() => [Note], { nullable: true })
  notes?: Note[];

  @Field(() => [Notebook], { nullable: true })
  notebooks?: Notebook[];

  @Field(() => [LinkGroup], { nullable: true })
  linkGroups?: LinkGroup[];

  @Field(() => [Link], { nullable: true })
  links?: Link[];

  @Field(() => [Task], { nullable: true })
  tasks?: Task[];

  @Field(() => [Comment], { nullable: true })
  comments?: Comment[];

  @Field(() => [NoteCollaboration], { nullable: true })
  collaborations?: NoteCollaboration[];

  @Field(() => [Invitation], { nullable: true })
  invitationsSent?: Invitation[];

  @Field(() => [Invitation], { nullable: true })
  invitationsReceived?: Invitation[];

  @Field(() => [Meet], { nullable: true })
  meets?: Meet[];

  @Field(() => [MeetSharedWithMember], { nullable: true })
  meetsShared?: MeetSharedWithMember[];

  @Field(() => [ResetToken], { nullable: true })
  resetTokens?: ResetToken[];

  context?: ContextualGraphqlRequest;
}
