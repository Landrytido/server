import { Field, InputType, Int } from "@nestjs/graphql";
import { CalendarEventType, Recurrence } from "@prisma/client";

@InputType()
export class CreateCalendarEventDto {
  @Field({ nullable: true })
  googleEventId?: string;

  @Field({ defaultValue: CalendarEventType.EVENT })
  eventType?: CalendarEventType;

  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  dueDate?: Date;

  @Field({ nullable: true })
  startDate?: Date;

  @Field({ nullable: true })
  endDate?: Date;

  @Field()
  isRecurring: boolean;

  @Field({ nullable: true })
  recurrence?: Recurrence; // Updated type

  @Field({ nullable: true })
  location?: string;

  @Field({ nullable: true })
  link?: string;

  @Field({ nullable: true })
  token?: string;

  @Field(() => Int, { nullable: true })
  notificationPreferenceId?: number;
}
