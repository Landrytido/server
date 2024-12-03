import { Injectable } from "@nestjs/common";
import * as sgMail from "@sendgrid/mail";

// Définir la clé API de SendGrid via une variable d'environnement
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

@Injectable()
export class EmailService {
  // Méthode pour envoyer un email d'invitation
  async sendInvitationEmail(
    recipientEmail: string,
    senderId: number,
    link: string
  ) {
    const msg = {
      to: recipientEmail, // L'email du destinataire
      from: "kareen_92@hotmail.fr", // L'email validé/vérifié sur SendGrid
      subject: "Vous avez reçu une invitation MyWebCompanion !",
      text: "Vous avez reçu une invitation pour rejoindre notre plateforme.",
      html: `<p>Cliquez <a href="${link}">ici</a> pour accepter l'invitation.</p>`,
    };

    try {
      await sgMail.send(msg); // Envoi de l'email via SendGrid
      console.log("Invitation email sent successfully!");
    } catch (error) {
      console.error("Error sending email:", error);
      throw new Error("Failed to send invitation email");
    }
  }
}
