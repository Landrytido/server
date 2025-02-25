import { Resolver, Mutation, Args, Int } from '@nestjs/graphql';
import { Platform } from '@prisma/client';
import { PushNotificationService } from "../../../Core/Notification/Service/push-notification.service";
import { PrismaService } from "../../../Core/Datasource/Prisma";
import { PushNotificationPayload } from "../../../Core/Notification/Interface/PushNotificationPayload";
import { GraphQLJSONObject } from 'graphql-type-json';
import {UseGuards} from "@nestjs/common";
import GraphqlAuthGuard from "../../../Core/Security/Guard/GraphqlAuthGuard";
import {ContextualRequest} from "../../../Core/Decorator/ContextualRequest";
import {ContextualGraphqlRequest as CtxRequest} from "../../../index";

@Resolver()
export class NotificationResolver {
    constructor(
	    private readonly pushNotificationService: PushNotificationService,
	    private readonly prisma: PrismaService,
    ) {}

    @UseGuards(GraphqlAuthGuard)
    @Mutation(() => Boolean)
    async sendPushNotification(
	    @ContextualRequest() context: CtxRequest,
	    @Args('title') title: string,
	    @Args('body') body: string,
	    @Args('data', { type: () => GraphQLJSONObject, nullable: true })
	    data?: Record<string, string>,
    ): Promise<boolean> {
	  const userId = context.userId;
	  // Fetch all device tokens for the user
	  const devices = await this.prisma.device.findMany({
		where: { userId },
	  });

	  await Promise.all(
		  devices.map(async (device) => {
			const payload: PushNotificationPayload = {
			    token: device.token,
			    title,
			    body,
			    data,
			};
			await this.pushNotificationService.sendNotification(payload);
		  }),
	  );

	  return true;
    }
    @UseGuards(GraphqlAuthGuard)
    @Mutation(() => Boolean)
    async registerDevice(
	    @ContextualRequest() context: CtxRequest,
	    @Args('token') token: string,
	    @Args('platform', { type: () => Platform }) platform: Platform,
    ): Promise<boolean> {
	  const userId = context.userId;
	  await this.prisma.device.upsert({
		where: { token },
		update: { userId, platform },
		create: { token, userId, platform },
	  });
	  return true;
    }
}
