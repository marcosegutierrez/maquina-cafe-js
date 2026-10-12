import { body } from 'express-validator';

export const loginEmailValidator = [
    body('email')
        .trim()
        .notEmpty()
        .withMessage('El email es obligatorio')
        .bail()
        .isEmail()
        .withMessage('Email inválido')
        .normalizeEmail()
];


export const loginCodeValidator = [
    body('access_code')
        .notEmpty()
        .withMessage('El código de acceso es obligatorio')
        .bail()
        .isInt({ min: 100000, max: 999999 })
        .withMessage('El código de acceso debe tener 6 dígitos')
];
