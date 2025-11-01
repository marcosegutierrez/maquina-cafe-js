import { body } from 'express-validator';

export const loginEmailValidator = [
    body('email')
        .isEmail()
        .withMessage('Email inválido')
        .normalizeEmail()
];