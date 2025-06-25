import { comparePassword, hashPassword } from "../utils/bcrip.util";
import { generatePartnerToken } from "../utils/token.util";
import { plainToInstance } from "class-transformer";
import { getPaginated } from "../utils/getPaginated";
import { PartnerRepository } from "../repository/partners.repository";
import { Partner } from "../infrastructure/entity/partners.entity";
import { CreatePartnerDto, UpdatePartnerDto } from "../infrastructure/dto/partners.dto";

export class PartnerService {
  constructor(private readonly PartnerRepository: PartnerRepository) {}

  /**
   * Get all Partners
   */
  async getAllPartners(): Promise<Partner[]> {
    return this.PartnerRepository.findAll();
  }

  /**
   * Get active Partners only
   */
  async getActivePartners(): Promise<Partner[]> {
    return this.PartnerRepository.findActivePartners();
  }

  /**
   * Get Partner by ID
   * @param id Partner ID
   */
  async getPartnerById(id: number): Promise<Partner> {
    return this.PartnerRepository.findById(id);
  }

  /**
   * Get Partner by name
   * @param name Partner name
   */
  async getPartnerByName(name: string): Promise<Partner | null> {
    return this.PartnerRepository.findByName(name);
  }

  /**
   * Get Partner by token
   * @param token Partner token
   */
  async getPartnerByToken(token: string): Promise<Partner | null> {
    return this.PartnerRepository.findByToken(token);
  }

  /**
   * Create a new Partner
   * @param PartnerData Partner data
   */
  async createPartner(partnerData: CreatePartnerDto): Promise<Partner> {
    const partner = plainToInstance(Partner, partnerData);
    const partnerExists = await this.PartnerRepository.findByEmail(partner.email);

    if (partnerExists) {
      throw new Error(`email with ${partnerData.name} already exists.`);
    }

    // Generar token único
    let token: string;
    let tokenExists: Partner | null;
    let attempts = 0;
    const maxAttempts = 10;

    do {
      token = generatePartnerToken();
      tokenExists = await this.PartnerRepository.findByTokenAnyStatus(token);
      attempts++;
      
      if (attempts >= maxAttempts) {
        throw new Error("Unable to generate unique token after multiple attempts");
      }
    } while (tokenExists);

    partner.password = await hashPassword(partnerData.password);
    partner.token = token;
    return this.PartnerRepository.create(partner);
  }

  async update(partnerData: UpdatePartnerDto): Promise<Partner> {
    const partner = plainToInstance(Partner, partnerData);
    const { id } = await this.PartnerRepository.findById(partnerData.id);
    const usedEmail = await this.PartnerRepository.findByEmail(partner.email);

    if (partner.email && usedEmail && usedEmail.id !== id) {
      throw new Error(`email "${partnerData.email}" is already in use.`);
    }

    // Validar token si se está actualizando
    if (partner.token) {
      const usedToken = await this.PartnerRepository.findByTokenAnyStatus(partner.token);
      if (usedToken && usedToken.id !== id) {
        throw new Error(`token "${partnerData.token}" is already in use by another partner.`);
      }
    }

    return this.PartnerRepository.update(partner.id, partner);
  }

  async updatePassword(id: number, newPassword: string): Promise<Partner> {
    const partner = await this.PartnerRepository.findById(id);
    if (await comparePassword(newPassword, partner.password)) {
      throw new Error("New password must be different from the current one");
    }
    const hashedPassword = await hashPassword(newPassword);
    return await this.PartnerRepository.updatePassword(id, hashedPassword);
  }

  async login(email: string, password: string): Promise<Partner> {
    const partner = await this.PartnerRepository.findByEmail(email);
    const isPasswordValid = await comparePassword(password, partner.password);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }
    return partner;
  }

  async softDelete(id: number): Promise<Partner> {
    const exists = await this.PartnerRepository.findById(id);
    if (!exists) {
      throw new Error(`Partner with ID ${id} not found`);
    }
    await this.PartnerRepository.softDelete(id);
    return exists;
  }

  async getPaginated(page: number, itemsPerPage: number): Promise<any> {
    return getPaginated<Partner>(this.PartnerRepository, page, itemsPerPage);
  }
}
