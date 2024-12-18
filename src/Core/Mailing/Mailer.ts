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
    // private readonly userRepository: UserRepository
  ) {
    this.client = new postmark.ServerClient(
      this.config.get("POSTMARK_SERVER_TOKEN")
    );
    // this.sender = `StockIO <${this.config.get("MAIL_SENDER")}>`;
    this.sender = `MyWebCompanion <${this.config.get("MAIL_SENDER")}>`; //modif si ok garder cette version et supprimer ligne dessus
  }

  getSender() {
    return this.sender;
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

    console.log("Subject translation:", data); //a supp

    const htmlContent = await this.mustache.render("fr/invitation.html", data);

    const subject = `${data.senderFirstName} ${data.senderLastName} ${data.t.emailSubject}`;
    console.log("SUBJECT", subject); // asupp

    try {
      await this.client.sendEmail({
        From: this.getSender(),
        To: recipientEmail,
        Subject: subject,
        HtmlBody: htmlContent,
      });
      console.log("Invitation email sent successfully!");
    } catch (error) {
      console.error("Error sending email:", error);
      throw new Error("Failed to send invitation email");
    }
  }
}
