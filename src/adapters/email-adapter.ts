import nodemailer from "nodemailer";



export const emailAdapter = {
    async sendEmail(email: string, confirmationCode: string){
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: 'forexperienceinincubatore@gmail.com', // generated ethereal user //forexperienceinincubatore@gmail.com
                pass: 'nbhygxjlzivnxxjh', // generated ethereal password //hyTgi1-nohwaw-gansab
            },
        });
        const info = await transporter.sendMail({
            from: '"Free help 🔐" <forexperienceinincubatore@gmail.com>', // sender address
            to: email, // list of receivers
            subject: "learn home task 07", // Subject line
           // html: `https://somesite.com/confirm-email?code=${confirmationCode}`
            html: `<h1>Thank for your registration</h1><p>To finish registration please follow the link below:<a href="https://somesite.com/confirm-email?code=${confirmationCode}">complete registration</a></p>`, // html body
        });
        return info.envelope
    }
}