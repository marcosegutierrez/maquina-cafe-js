export const auditsDocs = {
    paths: {
        "/api/v1/audits": {
            get: {
                summary: "Obtener logs de auditoría (Admin)",
                tags: ["Audits"],
                description: "Permite a un administrador obtener todos los logs de auditoría del sistema.",

                security: [
                    {
                        cookieAuth: []
                    }
                ],

                responses: {
                    200: {
                        description: "Logs obtenidos correctamente",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: {
                                            type: "boolean",
                                            example: true
                                        },

                                        logs: {
                                            type: "array",
                                            items: {
                                                type: "object",
                                                properties: {
                                                    _id: {
                                                        type: "string",
                                                        example: "662abc123"
                                                    },

                                                    entity: {
                                                        type: "string",
                                                        example: "order"
                                                    },

                                                    entityId: {
                                                        type: "string",
                                                        example: "661f123abc"
                                                    },

                                                    action: {
                                                        type: "string",
                                                        example: "SOFT_DELETE"
                                                    },

                                                    from: {
                                                        type: "string",
                                                        example: "pending"
                                                    },

                                                    to: {
                                                        type: "string",
                                                        example: "SOFT_DELETE"
                                                    },

                                                    performedBy: {
                                                        type: "string",
                                                        example: "660admin123"
                                                    },

                                                    reason: {
                                                        type: "string",
                                                        example: "Borrado de orden duplicada"
                                                    },

                                                    createdAt: {
                                                        type: "string",
                                                        example: "2026-05-15T18:30:00.000Z"
                                                    },

                                                    updatedAt: {
                                                        type: "string",
                                                        example: "2026-05-15T18:30:00.000Z"
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
        }
    }
};