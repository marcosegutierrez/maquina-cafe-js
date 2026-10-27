import { body, query } from 'express-validator';
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

export const paginationValidator = [
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('La página debe ser un entero positivo')
        .bail()
        .toInt(),

    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('El límite debe ser un entero entre 1 y 100')
        .bail()
        .toInt()
];


export const sortValidator = [
  query('sort')
    .optional()
    .isString()
    .withMessage('El ordenamiento debe ser un texto')
    .bail()
    .custom(value => {
      const allowedFields = [
        'timestamp',
        'status',
        'drink',
        'sugar'
      ];

      const field = value.startsWith("-")
        ? value.slice(1)
        : value;

      return allowedFields.includes(field);
    })
    .withMessage('Campo de ordenamiento inválido')
];


export const statusValidator = [
  query('status')
    .optional()
    .isString()
    .withMessage('El estado debe ser un texto')
    .bail()
    .isIn(['pending', 'confirmed', 'cancelled'])
    .withMessage('Estado inválido')
];
