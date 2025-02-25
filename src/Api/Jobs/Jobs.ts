import { SendCalendarEmailNotificationJob } from "./SendCalendarEmailNotificationJob";
import {AutoConfirmEndOfDayJob} from "./AutoConfirmEndOfDayJob";
import {GoogleCalendarSyncJob} from "./GoogleCalendarSyncJob";
import {SendCalendarPushNotificationJob} from "./SendCalendarPushNotificationJob";

export const Jobs = [
	SendCalendarEmailNotificationJob,
	SendCalendarPushNotificationJob,
	AutoConfirmEndOfDayJob,
	GoogleCalendarSyncJob
];
