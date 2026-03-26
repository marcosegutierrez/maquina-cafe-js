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
    "/api/v1/users/login-validator": {
      post: {
        summary: "Validar código de acceso",
        description:
          "Valida el código enviado al email del usuario para completar el proceso de login. Requiere que el usuario haya iniciado previamente el proceso en /login, donde se almacena el email en sesión. Incluye protección contra múltiples intentos fallidos.",
        tags: ["Users"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["access_code"],
                properties: {
                  access_code: {
                    type: "string",
                    example: "123456",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Login exitoso",
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
                      example: "Login Ok",
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Sesión de login expirada o inválida",
            content: {
              "application/json": {
                example: {
                  success: false,
                  message: "Sesión de login expirada",
                },
              },
            },
          },
          401: {
            description: "Código inválido o expirado",
            content: {
              "application/json": {
                examples: {
                  codigoIncorrecto: {
                    summary: "Código incorrecto",
                    value: {
                      success: false,
                      message: "El código o usuario no coincide",
                    },
                  },
                  codigoExpirado: {
                    summary: "Código expirado",
                    value: {
                      success: false,
                      message: "Código expirado",
                    },
                  },
                },
              },
            },
          },
          423: {
            description: "Cuenta bloqueada por intentos fallidos",
            content: {
              "application/json": {
                example: {
                  success: false,
                  message:
                    "Demasiados intentos fallidos. Intente más tarde.",
                },
              },
            },
          },
          429: {
            description: "Demasiados intentos (bloqueo temporal por sesión)",
            content: {
              "application/json": {
                example: {
                  success: false,
                  message:
                    "Demasiados intentos. Intente nuevamente más tarde.",
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
    "/api/v1/users/profile": {
      get: {
        summary: "Obtener perfil del usuario autenticado",
        description:
          "Devuelve la información del usuario autenticado. Requiere una sesión activa basada en cookies (connect.sid). La sesión expira luego de 15 minutos de inactividad. Incluye limitación de solicitudes por usuario.",
        tags: ["Users"],
        security: [
          {
            cookieAuth: [],
          },
        ],
        responses: {
          200: {
            description: "Perfil del usuario",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                      example: true,
                    },
                    user: {
                      type: "object",
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
                          example: "john@gmail.com",
                        },
                        role: {
                          type: "string",
                          example: "user",
                        },
                        id: {
                          type: "string",
                          example: "507f1f77bcf86cd799439011",
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          401: {
            description: "No autenticado o sesión expirada",
            content: {
              "application/json": {
                examples: {
                  noAutenticado: {
                    summary: "Usuario no autenticado",
                    value: {
                      success: false,
                      message: "No autenticado",
                    },
                  },
                  sesionExpirada: {
                    summary: "Sesión expirada",
                    value: {
                      success: false,
                      message: "Sesión expirada",
                    },
                  },
                },
              },
            },
          },
          429: {
            description: "Demasiadas solicitudes",
            content: {
              "application/json": {
                example: {
                  success: false,
                  message: "Demasiadas solicitudes, intentá más tarde",
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