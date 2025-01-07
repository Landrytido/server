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
      startDate: Date;
      endDate: Date;
      location: string;
    },
    eventType: "meeting" | "task" | "event"
  ) {
    const translations = (this.i18n.getTranslations() as Record<string, any>).fr
      .mailing.calendarNotification;

    const data = {
      eventTitle: eventDetails.title,
      startDate: eventDetails.startDate.toLocaleString(),
      endDate: eventDetails.endDate.toLocaleString(),
      description: eventDetails.description,
      organizerFirstName: recipientData.firstName,
      organizerLastName: recipientData.lastName,
      organizerEmail: recipientData.email,
      location: eventDetails.location,
      currentYear: new Date().getFullYear(),
      t: {
        ...translations,
        subject: translations.subject[eventType],
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
