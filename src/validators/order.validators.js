import { body } from 'express-validator';
import { DRINKS, normalizeDrink } from '../utils/order.utils.js';

export const createOrderValidator = [
    body('drink')
        .isString()
        .withMessage('La bebida debe ser un texto')
        .notEmpty()
        .withMessage('La bebida no puede estar vacía')
        .bail()
        .customSanitizer(normalizeDrink)
        .isIn(DRINKS)
        .withMessage('Bebida inválida'),

    body('sugar')
        .custom(value =>
            typeof value === 'number' &&
            Number.isInteger(value) &&
            value >= 0
        )
        .withMessage('El azúcar debe ser un número entero no negativo')
];

export const deleteOrderValidator = [
    body('reason')
        .isString()
        .withMessage('El motivo debe ser un texto')
        .bail()
        .trim()
        .notEmpty()
        .withMessage('El motivo no puede estar vacío')
        .bail()
        .isLength({ max: 250 })
        .withMessage('El motivo no puede superar los 250 caracteres')
];