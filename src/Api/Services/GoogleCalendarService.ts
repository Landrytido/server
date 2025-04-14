// File: src/Api/Services/GoogleCalendarService.ts

import { Injectable, Logger } from "@nestjs/common";
import axios from "axios";
import { Recurrence, CalendarEvent } from "@prisma/client";
import { DateTime } from "luxon";
import UserRepository from "../Repository/UserRepository";
import GoogleCalendarEventDto from "../Dto/CalendarEventDto/GoogleCalendarEventDto";
import { PrismaService } from "../../Core/Datasource/Prisma";

@Injectable()
export default class GoogleCalendarService {
  private readonly logger = new Logger(GoogleCalendarService.name);
  private currentAccessToken: string | null = null;

  setAccessToken(accessToken: string | null): void {
    this.currentAccessToken = accessToken;
  }

  constructor(
    private readonly userRepository: UserRepository,
    private readonly prisma: PrismaService
  ) {}

  // ===============================
  // PULL SYNC METHODS
  // ===============================

  /**
   * Formats a date string, adding a default time (09:00) for all-day events,
   * and converts it to the Europe/Paris timezone.
   */
  private formatDateTime(dateStr: string): string {
    let dt = DateTime.fromISO(dateStr, { zone: "utc" });
    if (dt.hour === 0 && dt.minute === 0) {
      dt = dt.set({ hour: 9, minute: 0 });
    }
    return dt.setZone("Europe/Paris").toISO();
  }

  /**
   * Converts an ISO date string from UTC to Europe/Paris timezone.
   */
  private convertToEuropeParis(dateStr: string): string {
    return DateTime.fromISO(dateStr, { zone: "utc" })
      .setZone("Europe/Paris")
      .toISO();
  }

  /**
   * Parses recurring data from a Google Calendar event.
   */
  async parseRecurringData(
    event: any
  ): Promise<{ isRecurring: boolean; recurringType: Recurrence }> {
    if (event.recurrence && Array.isArray(event.recurrence)) {
      const recurrenceRule: string = event.recurrence[0];
      const freqMatch = recurrenceRule.match(/FREQ=([A-Z]+)/);
      if (freqMatch && freqMatch[1]) {
        const freq = freqMatch[1];
        let recurringType: Recurrence = "NONE";
        switch (freq) {
          case "DAILY":
            recurringType = "DAILY";
            break;
          case "WEEKLY":
            recurringType = "WEEKLY";
            break;
          case "MONTHLY":
            recurringType = "MONTHLY";
            break;
          case "YEARLY":
          case "ANNUAL":
            recurringType = "ANNUAL";
            break;
          default:
            recurringType = "NONE";
        }
        return { isRecurring: true, recurringType };
      }
    }
    return { isRecurring: false, recurringType: "NONE" };
  }

  /**
   * Retrieves Google Calendar events for a given user.
   */
  async getEventsForUser(userId: number): Promise<GoogleCalendarEventDto[]> {
    const accessToken =
      this.currentAccessToken ||
      (await this.userRepository.findById(userId)).googleAccessToken;

    if (!accessToken) {
      throw new Error("User does not have a valid Google access token.");
    }

    const calendarUrl =
      "https://www.googleapis.com/calendar/v3/calendars/primary/events";
    try {
      const response = await axios.get(calendarUrl, {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { timeZone: "Europe/Paris" },
      });

      if (!response.data || !Array.isArray(response.data.items)) {
        this.logger.warn(
          'Google Calendar response does not include an "items" array.'
        );
        return [];
      }

      return await Promise.all(
        response.data.items.map(async (item: any) => {
          const recurringData = await this.parseRecurringData(item);
          return {
            id: item.id,
            summary: item.summary,
            description: item.description,
            due: this.formatDateTime(item.start?.dateTime || item.start?.date),
            start: this.formatDateTime(
              item.start?.dateTime || item.start?.date
            ),
            end: this.formatDateTime(item.end?.dateTime || item.end?.date),
            link: item?.hangoutLink,
            location: item.location,
            isRecurring: recurringData.isRecurring,
            recurringType: recurringData.recurringType,
          } as GoogleCalendarEventDto;
        })
      );
    } catch (error) {
      this.logger.error("Error fetching events from Google Calendar", error);
      throw error;
    }
  }

  /**
   * Retrieves Google Tasks for a given user and maps them as CalendarEvent DTOs.
   */
  async getTasksForUserAsEvents(
    userId: number
  ): Promise<GoogleCalendarEventDto[]> {
    const accessToken =
      this.currentAccessToken ||
      (await this.userRepository.findById(userId)).googleAccessToken;

    if (!accessToken) {
      throw new Error("User does not have a valid Google access token.");
    }

    const tasksUrl = "https://www.googleapis.com/tasks/v1/lists/@default/tasks";
    try {
      const response = await axios.get(tasksUrl, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!response.data || !Array.isArray(response.data.items)) {
        this.logger.warn(
          'Google Tasks response does not include an "items" array.'
        );
        return [];
      }

      return response.data.items.map((task: any) => {
        const dueDate = task.due;
        return {
          id: task.id,
          summary: task.title,
          description: task.notes || "",
          due: this.convertToEuropeParis(dueDate),
          start: this.convertToEuropeParis(dueDate),
          end: this.convertToEuropeParis(dueDate),
          link: task.webViewLink || "",
          location: "", // Tasks typically don't have a location.
          isRecurring: false,
          recurringType: "NONE",
        } as GoogleCalendarEventDto;
      });
    } catch (error) {
      this.logger.error("Error fetching tasks from Google Tasks API", error);
      throw error;
    }
  }

  // ===============================
  // PUSH SYNC METHODS
  // ===============================

  /**
   * Pushes a calendar event (EVENT type) to Google Calendar.
   * This method handles both creation and update.
   */
  async pushCalendarEvent(userId: number, event: CalendarEvent): Promise<void> {
    let accessToken = this.currentAccessToken;

    if (!accessToken) {
      const user = await this.userRepository.findById(userId);
      accessToken = user.googleAccessToken;
    }

    if (!accessToken) {
      this.logger.warn(
        `User ${userId} does not have a valid Google access token.`
      );
      return;
    }

    const payload: any = {
      summary: event.title,
      description: event.description,
      start: {
        dateTime: event.startDate.toISOString(),
        timeZone: "Europe/Paris",
      },
      end: { dateTime: event.endDate.toISOString(), timeZone: "Europe/Paris" },
      location: event.location,
    };

    if (event.recurrence && event.recurrence !== "NONE") {
      payload.recurrence = [`RRULE:FREQ=${event.recurrence}`];
    }

    try {
      if (event.googleEventId) {
        // Update the existing event on Google Calendar.
        await axios.put(
          `https://www.googleapis.com/calendar/v3/calendars/primary/events/${event.googleEventId}`,
          payload,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
      } else {
        // Create a new event on Google Calendar.
        const response = await axios.post(
          "https://www.googleapis.com/calendar/v3/calendars/primary/events",
          payload,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        const googleEventId = response.data.id;
        // Update the local record with the new Google event ID.
        await this.prisma.calendarEvent.update({
          where: { id: event.id },
          data: { googleEventId },
        });
      }
    } catch (error) {
      this.logger.error(
        `Error pushing calendar event (ID: ${event.id}) to Google:`,
        error
      );
      // Optionally mark the event as unsynced for later retry.
    }
  }

  /**
   * Pushes a task (TASK type) to Google Tasks.
   * This method handles both creation and update.
   */
  async pushTask(userId: number, task: CalendarEvent): Promise<void> {
    let accessToken = this.currentAccessToken;

    if (!accessToken) {
      const user = await this.userRepository.findById(userId);
      accessToken = user.googleAccessToken;
    }

    if (!accessToken) {
      this.logger.warn(
        `User ${userId} does not have a valid Google access token.`
      );
      return;
    }

    const payload = {
      title: task.title,
      notes: task.description,
      due: task.dueDate ? task.dueDate.toISOString() : undefined,
    };

    try {
      if (task.googleEventId) {
        // FIX: Problem here, requesst doesn't work
        await axios.put(
          `https://www.googleapis.com/tasks/v1/lists/@default/tasks/${task.googleEventId}`,
          { ...payload, id: task.googleEventId },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
      } else {
        const response = await axios.post(
          "https://www.googleapis.com/tasks/v1/lists/@default/tasks",
          payload,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        const googleTaskId = response.data.id;

        await this.prisma.calendarEvent.update({
          where: { id: task.id },
          data: { googleEventId: googleTaskId },
        });
      }
    } catch (error) {
      // this.logger.error(
      //   `Error pushing task (ID: ${task.id}) to Google Tasks:`,
      //   error,
      // );
      this.logger.error(
        `Error pushing task (ID: ${task.id}) to Google Tasks: ${error.response?.status} - ${error.response?.data}`
      );

      // Optionally mark the task as unsynced.
    }
  }

  // -------------------------------
  // Explicit Update Methods
  // -------------------------------

  /**
   * Explicitly updates a calendar event on Google Calendar.
   * If no googleEventId exists, it will create a new event.
   */
  async updateGoogleCalendarEvent(
    userId: number,
    event: CalendarEvent
  ): Promise<void> {
    // Reuse pushCalendarEvent, which handles update vs. creation.
    await this.pushCalendarEvent(userId, event);
  }

  /**
   * Explicitly updates a task on Google Tasks.
   * If no googleEventId exists, it will create a new task.
   */
  async updateGoogleTask(userId: number, task: CalendarEvent): Promise<void> {
    await this.pushTask(userId, task);
  }

  // -------------------------------
  // Explicit Delete Methods
  // -------------------------------

  /**
   * Deletes a calendar event from Google Calendar.
   */
  async deleteGoogleCalendarEvent(
    userId: number,
    event: CalendarEvent
  ): Promise<void> {
    if (!event.googleEventId) {
      this.logger.warn(
        `Event ID ${event.id} does not have a googleEventId; nothing to delete on Google.`
      );
      return;
    }

    // Utiliser d'abord le token défini par setAccessToken, puis utiliser celui de l'utilisateur si non défini
    let accessToken = this.currentAccessToken;

    if (!accessToken) {
      const user = await this.userRepository.findById(userId);
      accessToken = user.googleAccessToken;
    }

    if (!accessToken) {
      this.logger.warn(
        `User ${userId} does not have a valid Google access token.`
      );
      return;
    }

    try {
      await axios.delete(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events/${event.googleEventId}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
    } catch (error) {
      this.logger.error(
        `Error deleting calendar event (ID: ${event.id}) on Google:`,
        error
      );
      // Optionally handle error or mark for a retry.
    }
  }

  /**
   * Deletes a task from Google Tasks.
   */
  async deleteGoogleTask(userId: number, task: CalendarEvent): Promise<void> {
    if (!task.googleEventId) {
      this.logger.warn(
        `Task ID ${task.id} does not have a googleEventId; nothing to delete on Google.`
      );
      return;
    }
    let accessToken = this.currentAccessToken;

    if (!accessToken) {
      const user = await this.userRepository.findById(userId);
      accessToken = user.googleAccessToken;
    }

    if (!accessToken) {
      this.logger.warn(
        `User ${userId} does not have a valid Google access token.`
      );
      return;
    }

    try {
      await axios.delete(
        `https://www.googleapis.com/tasks/v1/lists/@default/tasks/${task.googleEventId}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
    } catch (error) {
      this.logger.error(
        `Error deleting task (ID: ${task.id}) on Google Tasks:`,
        error
      );
      // Optionally handle error or mark for a retry.
    }
  }

  /**
   * Force push synchronization for all calendar events (both events and tasks) of a user.
   * This can be invoked via a GraphQL mutation to re-sync any unsynced items.
   */
  async forcePushSync(userId: number): Promise<void> {
    const events = await this.prisma.calendarEvent.findMany({
      where: { userId },
    });

    for (const event of events) {
      try {
        if (event.eventType === "EVENT") {
          await this.pushCalendarEvent(userId, event);
        } else if (event.eventType === "TASK") {
          await this.pushTask(userId, event);
        }
      } catch (error) {
        this.logger.error(
          `Error during force push sync for event ID ${event.id}:`,
          error
        );
      }
    }
  }
}
