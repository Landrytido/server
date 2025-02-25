// notification.module.ts
import { Module } from '@nestjs/common';
import {PushNotificationService} from "./Service/push-notification.service";

@Module({
    providers: [PushNotificationService],
    exports: [PushNotificationService], // export if used by other modules
})
export class NotificationModule {}
