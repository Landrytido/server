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

  @Field(() => [Session])
  sessions: Session[];

  @Field(() => [Note])
  notes: Note[];

  @Field(() => [Notebook])
  notebooks: Notebook[];

  @Field(() => [LinkGroup])
  linkGroups: LinkGroup[];

  @Field(() => [Link])
  links: Link[];

  @Field(() => [Task])
  tasks: Task[];

  @Field(() => [Comment])
  comments: Comment[];

  @Field(() => [NoteCollaboration])
  collaborations: NoteCollaboration[];

  @Field(() => [Invitation])
  invitationsSent: Invitation[];

  @Field(() => [Invitation])
  invitationsReceived: Invitation[];

  @Field(() => [Meet])
  meets: Meet[];

  @Field(() => [MeetSharedWithMember])
  meetsShared: MeetSharedWithMember[];

  @Field(() => [ResetToken])
  resetTokens: ResetToken[];

  context?: ContextualGraphqlRequest;
}
