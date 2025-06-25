import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import dotenv from 'dotenv';
dotenv.config();

import { Express } from "express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Documentación API SOA",
      version: "1.0.0",
    },
    components: {
      schemas: {
         PartnerLoginDto: {
          type: "object",
          required: ["email", "password"],
          properties: {

            email: { type: "string", example: "juan@example.com" },
            password: { type: "string", example: "123456" },
    
          },
        },
        CreatePartnerDto: {
          type: "object",
          required: ["name", "lastname", "email", "password"],
          properties: {
            name: { type: "string", example: "Juan" },
            lastname: { type: "string", example: "Pérez" },
            email: { type: "string", example: "juan@example.com" },
            password: { type: "string", example: "123456" },
          },
        },
        UpdatePartnerDto: {
          type: "object",
          required: ["id"],
          properties: {
            id: { type: "integer", example: 1 },
            name: { type: "string", example: "Juan Actualizado" },
            lastname: { type: "string", example: "Pérez" },
            email: { type: "string", example: "juan_new@example.com" },
            token: { type: "string", example: "optional_token" },
          },
        },
        Partner: {
          type: "object",
          required: ["name", "email", "password", "token"],
          properties: {
            id: { type: "integer", example: 1 },
            name: { type: "string", example: "sebastian" },
            lastname: { type: "string", example: "perez" },
            email: { type: "string", example: "sebastian@example.com" },
            password: { type: "string", example: "123456" },
            token: { type: "string", example: "abc123token456", description: "Token único del partner (autogenerado)" },
            isActive: { type: "boolean", example: true },
            deleted: { type: "boolean", example: false },
            createdAt: { type: "string", format: "date-time", example: "2024-01-01T00:00:00Z" },
            updatedAt: { type: "string", format: "date-time", example: "2024-01-01T00:00:00Z" }
          },
        },
      },
    },
    servers: [
      {
         url: process.env.SWAGGER_SERVER_URL || 'http://localhost:2221/api',
      },
    ],
  },
  apis: ["src/routes/*.ts"], // debe apuntar a donde están tus rutas
};

const specs = swaggerJsdoc(options);

export function setupSwagger(app: Express) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
}
