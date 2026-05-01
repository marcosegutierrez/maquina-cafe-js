export const ordersDocs = {
    paths: {
        "/api/v1/orders": {
            post: {
                summary: "Crear una orden (usuario autenticado o invitado)",
                tags: ["Orders"],
                description: "Permite crear una orden de café o té. Si el usuario está autenticado, se asocia automáticamente a su cuenta.",

                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["drink", "sugar"],
                                properties: {
                                    drink: {
                                        type: "string",
                                        example: "latte"
                                    },
                                    sugar: {
                                        type: "number",
                                        example: 2
                                    }
                                }
                            }
                        }
                    }
                },

                responses: {
                    201: {
                        description: "Orden creada exitosamente",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean", example: true },
                                        message: { type: "string", example: "Orden creada exitosamente" },
                                        order: {
                                            type: "object",
                                            properties: {
                                                _id: { type: "string", example: "661f123abc" },
                                                drink: { type: "string", example: "latte" },
                                                sugar: { type: "number", example: 2 },
                                                status: { type: "string", example: "pending" },
                                                userId: {
                                                    type: "string",
                                                    nullable: true,
                                                    example: "660a12bc"
                                                },
                                                timestamp: {
                                                    type: "string",
                                                    example: "2026-04-25T15:00:00.000Z"
                                                },
                                                timestampFormatted: {
                                                    type: "string",
                                                    example: "25-04-2026 12:00 hs"
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },

                    400: {
                        description: "Datos inválidos"
                    },

                    500: {
                        description: "Error interno del servidor"
                    }
                }
            },

            get: {
                summary: "Obtener órdenes del usuario autenticado",
                tags: ["Orders"],
                description: "Retorna las órdenes del usuario logueado con paginación y ordenamiento",

                security: [
                    {
                        cookieAuth: []
                    }
                ],

                parameters: [
                    {
                        name: "page",
                        in: "query",
                        required: false,
                        schema: {
                            type: "number",
                            example: 1
                        }
                    },
                    {
                        name: "limit",
                        in: "query",
                        required: false,
                        schema: {
                            type: "number",
                            example: 10
                        }
                    },
                    {
                        name: "sort",
                        in: "query",
                        required: false,
                        schema: {
                            type: "string",
                            example: "-timestamp"
                        },
                        description: "Ordenamiento (ej: timestamp o -timestamp)"
                    }
                ],

                responses: {
                    200: {
                        description: "Órdenes obtenidas correctamente",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean", example: true },
                                        orders: {
                                            type: "object",
                                            properties: {
                                                page: { type: "number", example: 1 },
                                                limit: { type: "number", example: 10 },
                                                total: { type: "number", example: 25 },
                                                totalPages: { type: "number", example: 3 },
                                                data: {
                                                    type: "array",
                                                    items: {
                                                        type: "object",
                                                        properties: {
                                                            _id: { type: "string", example: "661f123abc" },
                                                            drink: { type: "string", example: "latte" },
                                                            sugar: { type: "number", example: 2 },
                                                            status: { type: "string", example: "pending" },
                                                            timestamp: {
                                                                type: "string",
                                                                example: "2026-04-25T15:00:00.000Z"
                                                            },
                                                            timestampFormatted: {
                                                                type: "string",
                                                                example: "25-04-2026 12:00 hs"
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },

                    401: {
                        description: "No autenticado"
                    },

                    500: {
                        description: "Error interno del servidor"
                    }
                }
            }
        },
        "/api/v1/orders/{id}": {
            get: {
                summary: "Obtener una orden por ID",
                tags: ["Orders"],
                description: "Permite obtener una orden específica. Solo el dueño o un administrador pueden acceder.",

                security: [
                    {
                        cookieAuth: []
                    }
                ],

                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: {
                            type: "string",
                            example: "661f123abc"
                        }
                    }
                ],

                responses: {
                    200: {
                        description: "Orden obtenida correctamente",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean", example: true },
                                        order: {
                                            type: "object",
                                            properties: {
                                                _id: { type: "string", example: "661f123abc" },
                                                drink: { type: "string", example: "latte" },
                                                sugar: { type: "number", example: 2 },
                                                status: { type: "string", example: "pending" },
                                                userId: { type: "string", example: "660a12bc" },
                                                timestamp: {
                                                    type: "string",
                                                    example: "2026-04-25T15:00:00.000Z"
                                                },
                                                timestampFormatted: {
                                                    type: "string",
                                                    example: "25-04-2026 12:00 hs"
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },

                    401: {
                        description: "No autenticado"
                    },

                    404: {
                        description: "Orden no encontrada o no disponible"
                    },

                    500: {
                        description: "Error interno del servidor"
                    }
                }
            }
        },
        "/api/v1/orders/all": {
            get: {
                summary: "Obtener todas las órdenes (Admin)",
                tags: ["Orders"],
                description: "Permite a un administrador obtener todas las órdenes con paginación, filtros y ordenamiento.",

                security: [
                    {
                        cookieAuth: []
                    }
                ],

                parameters: [
                    {
                        name: "page",
                        in: "query",
                        required: false,
                        schema: {
                            type: "number",
                            example: 1
                        }
                    },
                    {
                        name: "limit",
                        in: "query",
                        required: false,
                        schema: {
                            type: "number",
                            example: 10
                        }
                    },
                    {
                        name: "sort",
                        in: "query",
                        required: false,
                        schema: {
                            type: "string",
                            example: "-timestamp"
                        },
                        description: "Ordenamiento de resultados"
                    },
                    {
                        name: "status",
                        in: "query",
                        required: false,
                        schema: {
                            type: "string",
                            enum: ["pending", "confirmed", "cancelled"],
                            example: "pending"
                        },
                        description: "Filtrar órdenes por estado"
                    }
                ],

                responses: {
                    200: {
                        description: "Órdenes obtenidas correctamente",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: {
                                            type: "boolean",
                                            example: true
                                        },

                                        orders: {
                                            type: "object",
                                            properties: {
                                                page: {
                                                    type: "number",
                                                    example: 1
                                                },

                                                limit: {
                                                    type: "number",
                                                    example: 10
                                                },

                                                total: {
                                                    type: "number",
                                                    example: 35
                                                },

                                                totalPages: {
                                                    type: "number",
                                                    example: 4
                                                },

                                                data: {
                                                    type: "array",
                                                    items: {
                                                        type: "object",
                                                        properties: {
                                                            _id: {
                                                                type: "string",
                                                                example: "661f123abc"
                                                            },

                                                            drink: {
                                                                type: "string",
                                                                example: "espresso"
                                                            },

                                                            sugar: {
                                                                type: "number",
                                                                example: 1
                                                            },

                                                            status: {
                                                                type: "string",
                                                                example: "pending"
                                                            },

                                                            userId: {
                                                                type: "string",
                                                                nullable: true,
                                                                example: "660a12bc"
                                                            },

                                                            timestamp: {
                                                                type: "string",
                                                                example: "2026-04-25T15:00:00.000Z"
                                                            },

                                                            timestampFormatted: {
                                                                type: "string",
                                                                example: "25-04-2026 12:00 hs"
                                                            },

                                                            deletedAt: {
                                                                type: "string",
                                                                nullable: true,
                                                                example: null
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },

                    401: {
                        description: "No autenticado"
                    },

                    403: {
                        description: "Acceso denegado. Se requieren permisos de administrador"
                    },

                    500: {
                        description: "Error interno del servidor"
                    }
                }
            }
        },
        "/api/v1/orders/{id}/confirm": {
            patch: {
                summary: "Confirmar una orden",
                tags: ["Orders"],
                description: "Permite a un administrador confirmar una orden pendiente. Si la orden ya está confirmada, devuelve Ok",

                security: [
                    {
                        cookieAuth: []
                    }
                ],

                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: {
                            type: "string",
                            example: "661f123abc"
                        }
                    }
                ],

                responses: {
                    200: {
                        description: "Orden confirmada exitosamente",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: {
                                            type: "boolean",
                                            example: true
                                        },

                                        message: {
                                            type: "string",
                                            example: "Orden confirmada exitosamente"
                                        },

                                        order: {
                                            type: "object",
                                            properties: {
                                                _id: { type: "string", example: "661f123abc" },
                                                drink: { type: "string", example: "latte" },
                                                sugar: { type: "number", example: 2 },
                                                status: { type: "string", example: "pending" },
                                                userId: {
                                                    type: "string",
                                                    nullable: true,
                                                    example: "660a12bc"
                                                },
                                                timestamp: {
                                                    type: "string",
                                                    example: "2026-04-25T15:00:00.000Z"
                                                },
                                                timestampFormatted: {
                                                    type: "string",
                                                    example: "25-04-2026 12:00 hs"
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },

                    400: {
                        description: "Solo se pueden confirmar órdenes pendientes"
                    },

                    401: {
                        description: "No autenticado"
                    },

                    403: {
                        description: "Acceso denegado. Se requieren permisos de administrador"
                    },

                    404: {
                        description: "Orden no encontrada o no disponible"
                    },

                    500: {
                        description: "Error interno del servidor"
                    }
                }
            }
        }
    }
}