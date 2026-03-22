import swaggerJSDoc from "swagger-jsdoc";
import { usersDocs } from "./users.docs.js";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Máquina de Café",
      version: "1.0.0",
      description: "Documentación de API",
    },
    servers: [
      {
        url: "http://localhost:8080",
      },
    ],
    components: {
      schemas: {},
    },
  },
  apis: [],
};

const swaggerSpec = swaggerJSDoc(options);

swaggerSpec.paths = {
  ...usersDocs.paths,
};

swaggerSpec.components.schemas = {
  ...usersDocs.schemas,
};

export { swaggerSpec };