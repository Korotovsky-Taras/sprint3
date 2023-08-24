import {mailAdapter} from "../utils/mailAdapter";

class MailSender {
    async sendRegistrationMail(to: string, code: string) : Promise<boolean> {
        return mailAdapter.sendGmail({
            to,
            title: "Auth",
            subject: "confirm registration",
            html: `<h1>Thank for your registration</h1><p>To finish registration please follow the link below: <a href='https://somesite.com/confirm-email?code=${code}'>complete registration</a></p>`
        })
    }
}

export const mailSender = new MailSender();