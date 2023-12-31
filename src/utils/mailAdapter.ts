import nodemailer from "nodemailer";
import {appConfig} from "./config";
import Mail from "nodemailer/lib/mailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

type GmailAdapterConfig = {
    title: string,
    subject: string,
    to: string,
    html: string,
}

const isValidConfig = ({title, subject, to, html}: GmailAdapterConfig) : boolean => {
    const isTitleValid : boolean = Boolean(title) && title.length > 0;
    const isSubjectValid : boolean = Boolean(subject) && subject.length > 0;
    const isToValid : boolean =  Boolean(to) && to.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/) !== null;
    const isHtmlValid : boolean = Boolean(html) && html.length > 0;
    return isTitleValid && isSubjectValid && isToValid && isHtmlValid;
}

export const mailAdapter = {
    async sendGmail(config: GmailAdapterConfig) : Promise<boolean> {

        if (!isValidConfig(config)) {
            return false;
        }

        try {

            const transporter = nodemailer.createTransport({
                service: "gmail",
                host: 'smtp.gmail.com',
                auth: { user: appConfig.gmailAdapterUser, pass: appConfig.gmailAdapterPass }
            });

            const mail : Mail.Options = {
                from: `${config.title} <${appConfig.gmailAdapterUser}>`,
                to: config.to,
                html: config.html,
                subject: config.subject
            }

            const result: SMTPTransport.SentMessageInfo = await transporter.sendMail(mail);

            return result.accepted.includes(config.to)

        } catch (e: any) {
            console.log(`sendGEmail: ${e}`)
            return false;
        }

    }
}