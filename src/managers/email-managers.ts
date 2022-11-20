import {emailAdapter} from "../adapters/email-adapter";



export const emailManagers = {
    async sendEmailRecoveryMessage(email: string, confirmationCode: string){
        return await emailAdapter.sendEmail(email, confirmationCode)
    },
    async sendEmailConfirmation(email: string, confirmationCode: string){
        return await emailAdapter.sendEmail(email, confirmationCode)
    }
}