import nodemailer, { Transporter } from 'nodemailer';
import handlebars from 'handlebars';
import { readFileSync } from 'fs';

interface MessageInfo {
  id: string;
  name: string;
  email: string;
  title: string;
  description: string;
  link: string;
}

class SendMailService {
  private client: Transporter;

  constructor() {
    nodemailer
      .createTestAccount()
      .then(account => {
        const transporter = nodemailer.createTransport({
          host: account.smtp.host,
          port: account.smtp.port,
          secure: account.smtp.secure,
          auth: { user: account.user, pass: account.pass },
        });

        this.client = transporter;
      })
      .catch(err => console.log(err));
  }

  async execute(messageInfo: MessageInfo, path: string) {
    const templateFile = readFileSync(path).toString('utf-8');
    const mailTemplateParse = handlebars.compile(templateFile);
    const html = mailTemplateParse(messageInfo);

    const message = await this.client.sendMail({
      from: 'NPS <noreply@rocketseat.com.br>',
      to: messageInfo.email,
      subject: messageInfo.title,
      html,
    });

    console.log('Message sent: %s', message.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message));
  }

}

export default new SendMailService();
