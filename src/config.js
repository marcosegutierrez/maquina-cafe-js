import 'dotenv/config';

export default {
    MONGO_URL : process.env.MONGO_URL,
    PORT_GMAIL : process.env.PORT_GMAIL,
    EMAIL : process.env.EMAIL,
    PASSWORD : process.env.PASSWORD,
    SECRET_KEY : process.env.SECRET_KEY,
}

export const LOGIN_SECURITY = {
  MAX_ATTEMPTS: Number(process.env.MAX_ATTEMPTS),
  BLOCK_TIME_MS: Number(process.env.BLOCK_TIME_MS),
  MAIL_ATTEMPTS: Number(process.env.MAIL_ATTEMPTS)
}