// src/Api/Dto/GoogleCalendar/GoogleCalendarEventDto.ts
import { Recurrence } from '@prisma/client';

export default class GoogleCalendarEventDto {
    id: string;
    summary: string;
    description?: string;
    /** ISO-formatted date or dateTime string */
    start: string;
    /** ISO-formatted date or dateTime string */
    due: string;
    /** ISO-formatted date or dateTime string */
    end: string;
    location?: string;
    isRecurring: boolean;
    recurringType: Recurrence;
    link: string;
}
