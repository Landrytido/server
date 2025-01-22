import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { I18nService } from "nestjs-i18n";
import * as postmark from "postmark";
import MailMustacheRenderer from "./MailMustacheRenderer";

@Injectable()
export default class Mailer {
  private readonly client: postmark.Client;
  private readonly sender: string;

  constructor(
    private readonly config: ConfigService,
    private readonly i18n: I18nService,
    private readonly mustache: MailMustacheRenderer
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
      console.log(`Email sent successfully to ${recipientEmail}`);
    } catch (error) {
      console.error(`Error sending email to ${recipientEmail}:`, error);
      throw new Error("Failed to send email");
    }
  }

  async sendInvitationEmail(
    recipientEmail: string,
    senderInfo: { firstName: string; lastName: string },
    invitationLink: string
  ) {
    //Data pour le template
    const data = {
      senderFirstName: senderInfo.firstName,
      senderLastName: senderInfo.lastName,
      link: invitationLink,
      frontendUrl: process.env.FRONTEND_URL,
      currentYear: new Date().getFullYear(),
      t: (this.i18n.getTranslations() as Record<string, any>).fr.mailing
        .invitation,
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
    eventType: "meeting" | "task" | "event"
  ) {
    const translations = (this.i18n.getTranslations() as Record<string, any>).fr
      .mailing.calendarNotification;

    // Nettoyage des données pour exclure les champs vides ou null
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

    const isEventOrMeeting = eventType === "event" || eventType === "meeting";

    //Les données inclus dans le corps du mail
    const data = {
      ...filteredEventDetails,
      isEventOrMeeting: isEventOrMeeting, //asupp si besoin
      organizerFirstName: recipientData.firstName,
      organizerLastName: recipientData.lastName,
      organizerEmail: recipientData.email,
      // location: eventDetails.location, a supp si tout ok
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
