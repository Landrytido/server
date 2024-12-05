import { Injectable } from "@nestjs/common";
import * as sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

@Injectable()
export class EmailService {
  async sendInvitationEmail(
    recipientEmail: string,
    senderId: number,
    link: string
  ) {
    const personalMailSendgrid = "kareen_92@hotmail.fr";

    const msg = {
      to: recipientEmail,
      from: `${personalMailSendgrid}`,
      subject: "Vous avez reçu une invitation MyWebCompanion !",
      text: "Vous avez reçu une invitation pour rejoindre notre plateforme.",
      html: `<p>Cliquez <a href="${link}">ici</a> pour accepter l'invitation.</p>`,
    };

    try {
      await sgMail.send(msg);
      console.log("Invitation email sent successfully!");
    } catch (error) {
      console.error("Error sending email:", error);
      throw new Error("Failed to send invitation email");
    }
  }
}
