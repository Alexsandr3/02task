import {emailAdapter} from "../adapters/email-adapter";



export const emailManagers = {
    async sendEmailRecoveryMessage(email: string, confirmationCode: string) {
        const subject = "Finish password recovery"
        //const link = `${process.env.API_URL}/registration-confirmation?code=${confirmationCode}`
        const link = `https://somesite.com/registration-confirmation?code=${confirmationCode}`
        const message = `
        <h1>Password recovery</h1>
       <p>To finish password recovery please follow the link below:
          <a href='${link}'>recovery password</a>
      </p>`
        return await emailAdapter.sendEmail(email, subject, message)
    },
    async sendPasswordRecoveryMessage(email: string, confirmationCode: string) {
        const subject = "Password recovery"
        //const link = `${process.env.API_URL}/new-password?code=${confirmationCode}`
        const link = `https://somesite.com/password-recovery?recoveryCode=${confirmationCode}`
        const message = `
        <h1>Password recovery</h1>
       <p>To finish password recovery please follow the link below:
          <a href='${link}'>recovery password</a>
      </p>`
        return await emailAdapter.sendEmail(email, subject, message)
    },
    async sendEmailConfirmation(email: string, confirmationCode: string) {
        const subject = "Finish registration"
       // const link = `${process.env.API_URL}/registration-confirmation?code=${confirmationCode}`
        const link = `https://somesite.com/registration-confirmation?code=${confirmationCode}`
        const message = `
        <h1>Thank for your registration</h1>
       <p>To finish registration please follow the link below:
          <a href='${link}'>complete registration</a>
      </p>`
        console.log('03 - link', link)
        console.log('04 - message', message)
        return await emailAdapter.sendEmail(email, subject, message)
    }
}