import nodeMailer from "nodemailer";
import config from "../config/config.js";

const transporter = nodeMailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: config.GMAIL_USER,
    clientId: config.CLIENT_ID,
    clientSecret: config.CLIENT_SECRET,
    refreshToken: config.REFRESH_TOKEN,
  },
});

transporter.verify((error) => {
  if (error) {
    console.error("Unable to connect to the email service", error);
  } else {
    console.log("Email server is ready to send messages");
  }
});

export const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const info = await transporter.sendMail({
      from: `"Perplexity AI" <${config.GMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });
    console.log("Email sent successfully", info.messageId);
    console.log("Preview URL", nodeMailer.getTestMessageUrl(info));
  } catch (error) {
    console.error("Unable to send email to the email service", error);
  }
};
