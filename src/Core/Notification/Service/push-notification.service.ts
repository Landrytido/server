// src/Core/Notification/Service/push-notification.service.ts
import { Injectable, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { PushNotificationPayload } from '../Interface/PushNotificationPayload';

@Injectable()
export class PushNotificationService {
    private readonly logger = new Logger(PushNotificationService.name);

    constructor() {
	  // Initialize the Firebase app if it hasn't been already.
	  if (!admin.apps.length) {
		admin.initializeApp({
		    credential: admin.credential.cert({
			  projectId: process.env.FIREBASE_PROJECT_ID,
			  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
			  // Replace literal \n with actual newline characters
			  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
		    }),
		});
		this.logger.log('Firebase Admin initialized');
	  }
    }

    async sendNotification(payload: PushNotificationPayload): Promise<void> {
	  try {
		await admin.messaging().send({
		    token: payload.token,
		    notification: {
			  title: payload.title,
			  body: payload.body,
		    },
		    webpush: {
			  notification: {
				icon: '/icon.png',
			  },
		    },
		    data: payload.data,
		});
		// this.logger.log(`Notification sent to token: ${payload.token}`);
	  } catch (error: any) {
		// this.logger.error(`Error sending notification: ${error.message}`);
		// Optionally handle token removal or error reporting here.
	  }
    }
}
