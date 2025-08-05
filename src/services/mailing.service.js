import { createTransport } from "nodemailer";
import config from "../config.js";

const transporter = createTransport({
    service: 'gmail',
    port: config.PORT_GMAIL,
    secure: true,
    auth: {
        user: config.EMAIL,
        pass: config.PASSWORD
    }
});

const createMsgRegister = name => 
    `<h1>Hola ${name}, ¡Bienvenido/a al Ecomerce!</h1>`;

const createMsgLastConnection = name =>
    `<p>Hola ${name}, su cuenta ha sido desactivada por inactividad, logeese para reactivar su cuenta.</p>`

const createMsgLogin = (name, code) => 
    `<p>Hola ${name}, este es su código para inicio de sesión ${code}.</p>`

export const sendMail = async (user, service) => {
    try {
        const { name, email } = user;
        let msg = '';
        let subj = '';
        
        if (service === 'register') {
            msg = createMsgRegister(name)
            subj = 'Bienvenido/a'
        } else if (service === 'lastConnection') {
            msg = createMsgLastConnection(name)
            subj = 'Cuenta desactivada por inactividad'
        } else if (service === 'login') {
            msg = createMsgLogin(name, code)
            subj = `Codigo para inicio de sesión ${code}`
        }
        
        const gmailOptions = {
            from: config.EMAIL,
            to: email,
            subject: subj,
            html: msg
        };

        await transporter.sendMail(gmailOptions);
        console.log(`Email enviado ${msg}`);

    } catch (error) {
        throw new Error(error)
    }
}