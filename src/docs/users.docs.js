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
  },
};