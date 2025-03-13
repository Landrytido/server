import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as postmark from "postmark";
import MailMustacheRenderer from "./MailMustacheRenderer";
import { CalendarEventType } from "@prisma/client";

@Injectable()
export default class Mailer {
  private readonly client: postmark.Client;
  private readonly sender: string;
  private readonly logger = new Logger(Mailer.name);

  constructor(
        private readonly config: ConfigService,
        private readonly mustache: MailMustacheRenderer,
  ) {
    this.client = new postmark.ServerClient(
          this.config.get("POSTMARK_SERVER_TOKEN")
    );
    this.sender = `MyWebCompanion <${this.config.get("MAIL_SENDER")}>`;
  }

  getSender() {
    return this.sender;
  }

  async sendEmailToUser(
        recipientEmail: string,
        subject: string,
        templatePath: string,
        templateData: Record<string, any>
  ) {
    const htmlContent = await this.mustache.render(templatePath, templateData);

    try {
      await this.client.sendEmail({
        From: this.getSender(),
        To: recipientEmail,
        Subject: subject,
        HtmlBody: htmlContent,
      });
    } catch (error) {
      console.error(`Error sending email to ${recipientEmail}:`, error);
      this.logger.error(`Error sending email to ${recipientEmail}:`, error);
      throw new Error("Failed to send email");
    }
  }

  async sendInvitationEmail(
        recipientEmail: string,
        senderInfo: { firstName: string; lastName: string },
        invitationLink: string
  ) {
    const data = {
      senderFirstName: senderInfo.firstName,
      senderLastName: senderInfo.lastName,
      link: invitationLink,
      frontendUrl: process.env.FRONTEND_URL,
      currentYear: new Date().getFullYear(),
      // Hardcoded invitation text
      t: {
        emailSubject: "vous a envoyé une invitation",
        subject: "Vous avez reçu une invitation !",
        title: "Invitation à rejoindre MyWebCompanion",
        greeting: "Bonjour,",
        description: "vous a envoyé une demande d'amis.",
        otherDescription:
              "Pour accepter l'invitation, veuillez vous inscrire en cliquant sur le bouton ci-dessous.",
        acceptInvitation: "Accepter l'invitation",
        contactUs:
              "Si vous avez des questions, n'hésitez pas à nous contacter.",
      },
    };

    const subject = `${data.senderFirstName} ${data.senderLastName} ${data.t.emailSubject}`;
    await this.sendEmailToUser(
          recipientEmail,
          subject,
          "fr/invitation.html",
          data
    );
  }

  async sendCalendarNotificationEmail(
        recipientData: {
          email: string;
          firstName: string;
          lastName: string;
        },
        eventDetails: {
          title: string;
          description: string;
          startDate: Date | null;
          endDate: Date | null;
          dueDate: Date | null;
          location: string | null;
          place: string | null;
          url: string | null;
        },
        reminderLink: string,
        eventType: CalendarEventType
  ) {
    // Hardcoded calendar notification texts
    const translations = {
      emailSubject: "Rappel",
      subject: {
        TASK: "Une tâche à venir",
        EVENT: "Un événement à venir",
      },
      location: "Mode de participation",
      place: "Lieu",
      url: "Lien",
      descriptionData: "Description",
      organizerData: "Organisateur",
      guestData: "Invités",
      showDetails: {
        meeting: "Afficher tous les détails de la réunion",
        task: "Afficher tous les détails de la tâche",
        event: "Afficher tous les détails de l'événement",
      },
      contactUs:
            "Si vous avez des questions, n'hésitez pas à nous contacter.",
    };

    const filteredEventDetails = {
      ...(eventDetails.startDate
            ? { startDate: eventDetails.startDate.toLocaleString() }
            : {}),
      ...(eventDetails.endDate
            ? { endDate: eventDetails.endDate.toLocaleString() }
            : {}),
      ...(eventDetails.dueDate
            ? { dueDate: eventDetails.dueDate.toLocaleString() }
            : {}),
      ...(eventDetails.title?.trim() ? { title: eventDetails.title } : {}),
      ...(eventDetails.description?.trim()
            ? { description: eventDetails.description }
            : {}),
      ...(eventDetails.location?.trim()
            ? { location: eventDetails.location }
            : {}),
      ...(eventDetails.place?.trim() ? { place: eventDetails.place } : {}),
      ...(eventDetails.url?.trim() ? { url: eventDetails.url } : {}),
    };

    const isEventOrMeeting = eventType === CalendarEventType.EVENT;

    const data = {
      ...filteredEventDetails,
      isEventOrMeeting: isEventOrMeeting,
      organizerFirstName: recipientData.firstName,
      organizerLastName: recipientData.lastName,
      organizerEmail: recipientData.email,
      link: reminderLink,
      frontendUrl: process.env.FRONTEND_URL,
      currentYear: new Date().getFullYear(),
      t: {
        ...translations,
        subject: translations.subject[eventType],
        showDetails: translations.showDetails[eventType],
      },
    };

    const subject = `${data.t.emailSubject} : ${data.t.subject} !`;
    await this.sendEmailToUser(
          recipientData.email,
          subject,
          "fr/calendarNotification.html",
          data
    );
  }
}