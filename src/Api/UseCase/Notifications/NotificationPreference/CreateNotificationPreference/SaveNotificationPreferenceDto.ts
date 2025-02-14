import { Field, InputType, Int } from "@nestjs/graphql";
import {NotificationType, TimeUnit} from "@prisma/client";

@InputType()
export class SaveNotificationPreferenceDto {
  @Field(() => [NotificationType])
  types: NotificationType[];

  @Field(() => Int)
  timeBefore: number;

  @Field(() => TimeUnit)
  timeUnit: TimeUnit;
}
