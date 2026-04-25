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
            }
        }
    }
}