import { body } from "express-validator";

export const registerValidator = [
    body('email')
        .trim()
        .notEmpty()
        .withMessage('El email es obligatorio')
        .bail()
        .isEmail()
        .withMessage('Email inválido')
        .normalizeEmail(),

    body('name')
        .trim()
        .notEmpty()
        .withMessage('El nombre es obligatorio')
        .bail()
        .isString()
        .withMessage('El nombre debe ser un texto')
        .isLength({ min: 2, max: 50 })
        .withMessage('El nombre debe tener entre 2 y 50 caracteres'),

    body('nickname')
        .trim()
        .notEmpty()
        .withMessage('El nickname es obligatorio')
        .bail()
        .isString()
        .withMessage('El nickname debe ser un texto')
        .isLength({ min: 2, max: 30 })
        .withMessage('El nickname debe tener entre 2 y 30 caracteres')
];