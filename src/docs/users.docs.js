export const usersDocs = {
  paths: {
    "/api/v1/users/register": {
      post: {
        summary: "Registro de un nuevo usuario",
        description:
          "Permite registrar un usuario nuevo en el sistema. Si el email ya está registrado, devuelve un error 409. Luego del registro, se envía un email de bienvenida.",
        tags: ["Users"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "nickname", "email"],
                properties: {
                  name: {
                    type: "string",
                    example: "John",
                  },
                  nickname: {
                    type: "string",
                    example: "johndev",
                  },
                  email: {
                    type: "string",
                    format: "email",
                    example: "john@gmail.com",
                  }
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Usuario registrado correctamente",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                      example: true,
                    },
                    message: {
                      type: "string",
                      example: "Usuario registrado correctamente",
                    },
                    user: {
                      type: "object",
                      properties: {
                        id: {
                          type: "string",
                          example: "507f1f77bcf86cd799439011",
                        },
                        name: {
                          type: "string",
                          example: "John",
                        },
                        nickname: {
                          type: "string",
                          example: "johndev",
                        },
                        email: {
                          type: "string",
                          example: "john@gmail.com",
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          409: {
            description: "El usuario ya existe",
            content: {
              "application/json": {
                example: {
                  success: false,
                  message: "Este usuario ya se encuentra registrado",
                },
              },
            },
          },
          500: {
            description: "Error interno del servidor",
          },
        },
      },
    },
    "/api/v1/users/login": {
      post: {
        summary: "Inicio de sesión con email",
        description:
          "Inicia el proceso de autenticación enviando un código de acceso al email del usuario si existe. El email se guarda temporalmente en sesión para ser validado posteriormente en el endpoint /login-validator. Incluye limitación de intentos y bloqueo temporal por seguridad.",
        tags: ["Users"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email"],
                properties: {
                  email: {
                    type: "string",
                    format: "email",
                    example: "john@gmail.com",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Proceso de login iniciado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                      example: true,
                    },
                    message: {
                      type: "string",
                      example:
                        "Si el usuario existe se enviará un código de acceso a su email",
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Email inválido",
            content: {
              "application/json": {
                example: {
                  success: false,
                  message: "Email inválido",
                },
              },
            },
          },
          423: {
            description: "Cuenta bloqueada temporalmente",
            content: {
              "application/json": {
                examples: {
                  cuentaBloqueada: {
                    summary: "Cuenta bloqueada",
                    value: {
                      success: false,
                      message:
                        "Su cuenta está bloqueada debido a múltiples intentos fallidos. Intente nuevamente más tarde.",
                    },
                  },
                  demasiadosIntentos: {
                    summary: "Demasiados intentos de envío de código",
                    value: {
                      success: false,
                      message:
                        "Demasiados intentos de envío de código. Su cuenta ha sido bloqueada temporalmente.",
                    },
                  },
                },
              },
            },
          },
          429: {
            description: "Demasiados intentos de login (rate limit)",
            content: {
              "application/json": {
                example: {
                  error:
                    "Demasiados intentos de login, intenta más tarde.",
                },
              },
            },
          },
          500: {
            description: "Error interno del servidor",
          },
        },
      },
    },
  },
};