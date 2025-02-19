import { SendCalendarEmailNotificationJob } from "./SendCalendarEmailNotificationJob";
import {AutoConfirmEndOfDayJob} from "./AutoConfirmEndOfDayJob";
import {GoogleCalendarSyncJob} from "./GoogleCalendarSyncJob";

export const Jobs = [
	SendCalendarEmailNotificationJob,
	AutoConfirmEndOfDayJob,
	GoogleCalendarSyncJob
];
