import mongoose from "mongoose";
import { AppError } from "../utils/errors.js";

export const validateObjectId = (paramName = "id") => {
    return (req, res, next) => {
        const value = req.params[paramName];

        if (!mongoose.Types.ObjectId.isValid(value)) {
            return next(
                new AppError(`El parámetro '${paramName}' no es un ObjectId válido`, 400)
            );
        }

        next();
    };
};