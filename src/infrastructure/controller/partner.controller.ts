// src/controllers/partner.controller.ts
import { Request, Response } from "express";
import { CreatePartnerDto, UpdatePartnerDto } from "../dto/partners.dto";
import { PartnerService } from "../../service/partner.service";
import { plainToInstance } from "class-transformer";

export class PartnerController {
  private readonly partnerService: PartnerService;

  constructor(service: PartnerService) {
    this.partnerService = service;
  }

  async softDelete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const partnerId = id as unknown as number;

      const partner = await this.partnerService.softDelete(partnerId);
      res.status(200).json(partner);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async updatePassword(req: Request, res: Response) {
    try {
      const id = req.body.id as unknown as number;
      const password = req.body.password as unknown as string;
      const response = await this.partnerService.updatePassword(id, password);
      res.status(200).json(response);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async login(req: Request, res: Response) { 
    try {
      const loginData = plainToInstance(CreatePartnerDto, req.body, {
        excludeExtraneousValues: true
      });
    
      if (!loginData.email || !loginData.password) {
        throw new Error("Email and password are required");
      }

      const partner = await this.partnerService.login(loginData.email, loginData.password);

      return res.status(200).json(partner);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const partnerId = id as unknown as number;

      const partner = await this.partnerService.getPartnerById(partnerId);
      res.status(200).json(partner);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getByToken(req: Request, res: Response) {
    try {
      const { token } = req.params;

      if (!token) {
        return res.status(400).json({ message: "Token is required" });
      }

      const partner = await this.partnerService.getPartnerByToken(token);
      
      if (!partner) {
        return res.status(404).json({ message: "Partner not found or inactive", success:false  });
      }

      res.status(200).json({
        partner,
        success: true
      });
    } catch (error) {
      res.status(400).json({ message: error.message, success:false });
    }
  }

  async getPaginated(req: Request, res: Response) {
    try {
      const { page, items } = req.query;
      console.log(req.query);

      const parsedPage = Number(page) - 1;
      const parsedItems = Number(items);

      if (parsedPage < 0) {
        throw new Error("Wrong data");
      }

      const result = await this.partnerService.getPaginated(
        parsedPage,
        parsedItems
      );
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async createPartner(req: Request, res: Response) {
    try {
      const data: CreatePartnerDto = req.body;
      const newPartner = await this.partnerService.createPartner(data);
      res.status(201).json(newPartner);
    } catch (error) {
      if (error.message.includes("already exists")) {
        res.status(409).json({ message: error.message });
      } else if (error.message.includes("Unable to generate unique token")) {
        res.status(500).json({ message: error.message });
      } else {
        res.status(400).json({ message: error.message });
      }
    }
  }

  async updatePartner(req: Request, res: Response) {
    try {
      const data = plainToInstance(UpdatePartnerDto, req.body, {
        excludeExtraneousValues: true 
      });
      const newPartner = await this.partnerService.update(data);
      res.status(201).json(newPartner);
    } catch (error) {
      if (error.message.includes("already in use")) {
        res.status(409).json({ message: error.message });
      } else {
        res.status(400).json({ message: error.message });
      }
    }
  }
}
