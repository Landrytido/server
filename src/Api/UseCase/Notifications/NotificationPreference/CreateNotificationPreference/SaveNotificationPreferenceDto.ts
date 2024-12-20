import { Field, InputType, Int } from "@nestjs/graphql";
import { NotificationType, TimeUnit } from "src/main";

@InputType()
export class SaveNotificationPreferenceDto {
  @Field(() => NotificationType)
  type: NotificationType;

  @Field(() => Int)
  timeBefore: number;

  @Field(() => TimeUnit)
  timeUnit: TimeUnit;
}
