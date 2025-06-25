import { Router } from "express";
import { PartnerController } from "../infrastructure/controller/partner.controller";

/**
 * @swagger
 * tags:
 *   name: Partners
 *   description: API para la gestión de partners
 */
export class PartnerRoutes {
  private router: Router;
  private controller: PartnerController;

  constructor(partnerController: PartnerController) {
    this.router = Router();
    this.controller = partnerController;

    /**
     * @swagger
     * /partners:
     *   put:
     *     summary: Actualizar un partner existente
     *     tags: [Partners]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/UpdatePartnerDto'
     *     responses:
     *       201:
     *         description: Partner actualizado correctamente
     *       400:
     *         description: Error en la solicitud
     *       409:
     *         description: Email o token ya está en uso por otro partner
     */
    this.router.put("/", this.controller.updatePartner.bind(this.controller));

    /**
     * @swagger
     * /partners:
     *   post:
     *     summary: Crear un nuevo partner
     *     description: Crea un nuevo partner con un token único autogenerado
     *     tags: [Partners]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CreatePartnerDto'
     *     responses:
     *       201:
     *         description: Partner creado correctamente con token autogenerado
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Partner'
     *       400:
     *         description: Error de validación o de datos
     *       409:
     *         description: El partner ya existe o error al generar token único
     *       500:
     *         description: Error interno del servidor
     */
    this.router.post("/", this.controller.createPartner.bind(this.controller));

    /**
     * @swagger
     * /partners/update-password:
     *   post:
     *     summary: Actualizar la contraseña de un partner
     *     tags: [Partners]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               id:
     *                 type: integer
     *                 example: 1
     *               password:
     *                 type: string
     *                 example: nuevaPassword123
     *     responses:
     *       200:
     *         description: Contraseña actualizada correctamente
     *       400:
     *         description: Error al actualizar la contraseña
     */
    this.router.post(
      "/update-password",
      this.controller.updatePassword.bind(this.controller)
    );

    /**
     * @swagger
     * /partners:
     *   get:
     *     summary: Obtener lista paginada de partners
     *     tags: [Partners]
     *     parameters:
     *       - in: query
     *         name: page
     *         schema:
     *           type: integer
     *           example: 1
     *         description: Página a obtener
     *       - in: query
     *         name: items
     *         schema:
     *           type: integer
     *           example: 10
     *         description: Cantidad de partners por página
     *     responses:
     *       200:
     *         description: Lista paginada de partners
     *       400:
     *         description: Error en los parámetros
     */
    this.router.get("/", this.controller.getPaginated.bind(this.controller));

    /**
     * @swagger
     * /partners/{id}:
     *   get:
     *     summary: Obtener partner por ID
     *     tags: [Partners]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *           example: 1
     *     responses:
     *       200:
     *         description: Partner encontrado
     *       400:
     *         description: Partner no encontrado o ID inválido
     */
    this.router.get("/:id", this.controller.getById.bind(this.controller));

    /**
     * @swagger
     * /partners/token/{token}:
     *   get:
     *     summary: Obtener partner por token
     *     description: Obtiene un partner activo y no eliminado por su token
     *     tags: [Partners]
     *     parameters:
     *       - in: path
     *         name: token
     *         required: true
     *         schema:
     *           type: string
     *           example: "abc123token456"
     *         description: Token único del partner
     *     responses:
     *       200:
     *         description: Partner encontrado
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Partner'
     *       400:
     *         description: Token requerido
     *       404:
     *         description: Partner no encontrado o inactivo
     */
    this.router.get("/token/:token", this.controller.getByToken.bind(this.controller));

   /**
 * @swagger
 * /partners/login:
 *   post:
 *     summary: Iniciar sesión de partner
 *     description: Inicia sesión de un partner existente
 *     tags: [Partners]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PartnerLoginDto'
 *     responses:
 *       200:
 *         description: Login exitoso
 *       400:
 *         description: Credenciales inválidas
 */
this.router.post("/login", this.controller.login.bind(this.controller));

}

  public  getRoutes(): Router {
    return this.router;
  }
}
