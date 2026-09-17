import { body } from "express-validator";

export const registerValidator = [
    body('email')
        .isEmail()
        .withMessage('Email inválido')
        .normalizeEmail(),

    body('name')
        .trim()
        .notEmpty()
        .withMessage('El nombre es obligatorio'),

    body('nickname')
        .trim()
        .notEmpty()
        .withMessage('El nickname es obligatorio')
];