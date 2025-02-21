import {Field, GraphQLISODateTime, Int, ObjectType} from "@nestjs/graphql";
import {ContextualGraphqlRequest} from "../../index";
import Session from "./Session";
import Note from "./Note";
import Notebook from "./Notebook";
import LinkGroup from "./LinkGroup";
import Link from "./Link";
import Task from "./Task";
import {NoteCollaboration} from "./NoteCollaboration";
import Invitation from "./Invitation";
import MeetSharedWithMember from "./MeetSharedWithMember";
import ResetToken from "./ResetToken";
import Comment from "./Comment";
import SearchHistory from "./SearchHistory";
import { Relation } from "./Relation";
import { NotificationPreference } from "./NotificationPreference";
import CalendarEvent from "./CalendarEvent/CalendarEvent";

@ObjectType()
export default class User {
  @Field(() => Int)
  id: number;

  @Field()
  email: string;

  password: string;

  @Field({nullable: true})
  firstName?: string; // Permettre le nullable

  @Field({nullable: true})
  lastName?: string; // Permettre le nullable

  @Field({ nullable: true })
  lastLoginDate?: Date;

  @Field(() => [Session])
  sessions?: Session[];

  @Field(() => [Note])
  notes?: Note[];

  @Field(() => [Notebook])
  notebooks?: Notebook[];

  @Field(() => [LinkGroup])
  linkGroups?: LinkGroup[];

  @Field(() => [Link])
  links?: Link[];

  @Field(() => [Task])
  tasks?: Task[];

  @Field(() => [Comment])
  comments?: Comment[];

  @Field(() => [NoteCollaboration])
  collaborations?: NoteCollaboration[];

  @Field(() => [Invitation])
  invitationsSent?: Invitation[];

  @Field(() => [Invitation])
  invitationsReceived?: Invitation[];

  @Field(() => [Relation])
  friends?: Relation[];

  @Field(() => [NotificationPreference])
  notificationPreferences?: NotificationPreference[];

  @Field(() => [MeetSharedWithMember])
  meetsShared?: MeetSharedWithMember[];

  @Field(() => [ResetToken])
  resetTokens?: ResetToken[];

  @Field(() => GraphQLISODateTime)
  createdAt: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt: Date;

  @Field(() => [SearchHistory])
  searchHistory?: SearchHistory[];

  @Field(() => [CalendarEvent])
  calendarEvents?: CalendarEvent[];

  @Field({ nullable: true })
  googleAccessToken?: string;

  @Field({ nullable: true })
  googleRefreshToken?: string;

  context?: ContextualGraphqlRequest;
}