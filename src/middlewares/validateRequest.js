import { validationResult } from "express-validator";
import { AppError } from "../utils/errors.js";

export const validateRequest = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const messages = errors
            .array()
            .map(error => error.msg)
            .join(". ");

        throw new AppError(messages, 400);
    }

    next();
};