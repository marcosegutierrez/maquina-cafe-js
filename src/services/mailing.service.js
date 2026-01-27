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
    `<div style="font-family: Arial">
      <h1>Hola ${name}, ¡Bienvenido/a al Ecomerce!</h1>
        <img 
        src="https://raw.githubusercontent.com/marcosegutierrez/maquina-cafe-js/refs/heads/main/assets/email/firma_mail_02.PNG" 
        alt="Firma de correo"
        width="350"
        />
      </div>`;

const createMsgLastConnection = name =>
    `<div style="font-family: Arial">
      <p>Hola ${name}, su cuenta ha sido desactivada por inactividad, logeese para reactivar su cuenta.</p>
        <img 
        src="https://raw.githubusercontent.com/marcosegutierrez/maquina-cafe-js/refs/heads/main/assets/email/firma_mail_02.PNG" 
        alt="Firma de correo"
        width="350"
        />
      </div>`;

const createMsgLogin = (name, code) => 
    `<div style="font-family: Arial">
      <p>Hola ${name}, este es su código para inicio de sesión ${code}.<br><br>El mismo expira en 5 minutos.</p>
        <img 
        src="https://raw.githubusercontent.com/marcosegutierrez/maquina-cafe-js/refs/heads/main/assets/email/firma_mail_02.PNG" 
        alt="Firma de correo"
        width="350"
        />
      </div>`;

export const sendMail = async (user, service, code = 0) => {
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