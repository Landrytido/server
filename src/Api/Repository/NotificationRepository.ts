import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { PrismaService } from 'src/Core/Datasource/Prisma';
import * as webPush from 'web-push';

@Injectable()
export class NotificationRepository {

  constructor(private prisma: PrismaService) {
    // Initialize Firebase Admin SDK with your credentials
    if (admin.apps.length === 0) {
      admin.initializeApp({
        credential: admin.credential.applicationDefault(), // Use your Firebase credentials here
      });
    }
  }

  // Method to send an FCM notification
  private async sendFCMNotification(token: string, message: string, data: any) {
    try {
      await admin.messaging().send({
        token,
        notification: {
          title: 'Notification',
          body: message,
        },
        data,
      });
    } catch (error) {
      if (error.code === 'messaging/registration-token-not-registered') {
        // Token is no longer valid, so remove it from the database
        await this.prisma.deviceToken.delete({
          where: { token },
        });
      }
      console.error('Error sending FCM notification:', error);
    }
  }

  // Method to send notifications to multiple devices of a user
  async sendPushNotification(userId: number, message: string, additionalData: any) {
    const devices = await this.prisma.deviceToken.findMany({
      where: { userId },
    });

    const notifications = devices.map((device) => {
      if (device.platform === 'android' || device.platform === 'ios') {
        return this.sendFCMNotification(device.token, message, additionalData);
      } else if (device.platform === 'web') {
        return this.sendWebPushNotification(device.token, message, additionalData);
      }
    });

    await Promise.all(notifications);
  }

  // Method to send a web push notification
  private async sendWebPushNotification(token: string, message: string, data: any) {
    try {
      const payload = JSON.stringify({
        notification: {
          title: 'Notification',
          body: message,
        },
        data,
      });
      await webPush.sendNotification(token, payload);
    } catch (error) {
      console.error('Error sending web push notification:', error);
    }
  }
}
