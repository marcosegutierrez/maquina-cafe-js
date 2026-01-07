import { AppError } from "../utils/errors.js";

export const protectLoginCode = (req, res, next) => {
    const now = Date.now();

    if ( !req.session.loginAttempts ) {
        req.session.loginAttempts = 0;
    }

    if (req.session.blockedUntil && now < req.session.blockedUntil) {
        return next(
            new AppError(
                'Demasiados intentos. Intente nuevamente más tarde.',
                429
            )
        );
    }

    next();
}