import { body } from 'express-validator';
import { DRINKS, normalizeDrink } from '../utils/order.utils.js';

export const createOrderValidator = [
    body('drink')
        .isString()
        .withMessage('La bebida debe ser un texto')
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