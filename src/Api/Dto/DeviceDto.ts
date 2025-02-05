import { Field, InputType, ObjectType } from "@nestjs/graphql";

@ObjectType()  
export default class DeviceDto {
  @Field()
  userId: number;

  @Field()
  platform: string;

  @Field()
  token: string;
}


@InputType()
export class AdditionalDataInput {
  @Field({ nullable: true })
  link?: string;
}
