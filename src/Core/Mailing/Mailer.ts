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
    recipientEmail: string,
    eventTitle: string,
    timeBefore: number,
    timeUnit: string
  ) {
    const data = {
      eventTitle,
      timeBefore,
      timeUnit,
      t: (this.i18n.getTranslations() as Record<string, any>).fr.mailing
        .calendarNotification,
    };

    const subject = `${data.t.emailSubject} : ${data.eventTitle}`;
    await this.sendEmailToUser(
      recipientEmail,
      subject,
      "fr/calendarNotification",
      data
    );
  }
}
