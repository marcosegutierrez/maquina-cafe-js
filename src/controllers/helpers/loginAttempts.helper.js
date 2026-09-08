import { LOGIN_SECURITY } from "../../config.js";

export const registerSessionLoginAttempt = (session) => {
    session.loginAttempts = (session.loginAttempts || 0) + 1;

    if (session.loginAttempts >= LOGIN_SECURITY.CODE_ATTEMPTS) {
        session.blockedUntil =
            Date.now() + LOGIN_SECURITY.BLOCK_TIME_MS;
    }
};