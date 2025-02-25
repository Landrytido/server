// src/Api/Resolver/Notification/NotificationResolver.ts
import {Resolver, Mutation, Args, Int} from '@nestjs/graphql';
import {Platform} from '@prisma/client';
import {PushNotificationService} from "../../../Core/Notification/Service/push-notification.service";
import {PrismaService} from "../../../Core/Datasource/Prisma";
import {PushNotificationPayload} from "../../../Core/Notification/Interface/PushNotificationPayload";
import {GraphQLJSONObject} from 'graphql-type-json';
import {UseGuards} from "@nestjs/common";
import GraphqlAuthGuard from "../../../Core/Security/Guard/GraphqlAuthGuard";
import {ContextualRequest} from "../../../Core/Decorator/ContextualRequest";
import {ContextualGraphqlRequest as CtxRequest} from "../../../index";

@Resolver()
export class NotificationResolver {
    constructor(
	    private readonly pushNotificationService: PushNotificationService,
	    private readonly prisma: PrismaService,
    ) {
    }

    @UseGuards(GraphqlAuthGuard)
    @Mutation(() => Boolean)
    async sendPushNotification(
	    @ContextualRequest() context: CtxRequest,
	    @Args('title') title: string,
	    @Args('body') body: string,
	    @Args('data', {type: () => GraphQLJSONObject, nullable: true})
	    data?: Record<string, string>,
    ): Promise<boolean> {
	  const userId = context.userId;
	  // Fetch all device tokens for the user
	  const devices = await this.prisma.device.findMany({
		where: {userId},
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
	    @Args('platform', {type: () => Platform}) platform: Platform,
    ): Promise<boolean> {
	  const userId = context.userId;

	  // Check if a device with this token already exists
	  const existingDevice = await this.prisma.device.findUnique({where: {token}});

	  if (existingDevice) {
		if (existingDevice.userId !== userId) {
		    // The token is already registered to a different user.
		    throw new Error('Device token already registered to another user.');
		} else {
		    // Update the device's platform if necessary.
		    await this.prisma.device.update({
			  where: {token},
			  data: {platform},
		    });
		}
	  } else {
		// Create a new device record.
		await this.prisma.device.create({
		    data: {token, userId, platform},
		});
	  }

	  return true;
    }
}
