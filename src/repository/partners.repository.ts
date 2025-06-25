// src/repositories/PartnerRepository.ts
import { Repository, DeleteResult, UpdateResult } from "typeorm";
import { Partner } from "../infrastructure/entity/partners.entity";
import { IBaseRepository } from "./base-repository.interface";

export class PartnerRepository implements IBaseRepository<Partner> {
  public constructor(private repository: Repository<Partner>) {
    this.repository = repository;
  }

  async getPaginated(limit: number, offset: number): Promise<any> {
    if (limit < 1 || offset < 0) {
      throw new Error("Invalid pagination parameters");
    }

    const [data] = await this.repository.findAndCount({
      skip: offset,
      take: limit,
      order: {
        createdAt: "DESC",
      },
      where: {
        deleted: false,
      },
    });
    const count = await this.repository.count({
      where: {
        deleted: false,
      },
    });

    const response = {
      partners: data,
      count: count,
    };

    return response;
  }

  async findAll(): Promise<Partner[]> {
    return this.repository.find();
  }

  
  async findById(id: number): Promise<Partner> {
    const partner = this.repository.findOneBy({ id });
    if (!partner) {
      throw new Error(`Partner with ID ${id} not found`);
    }
    return partner;
  }

  async findByCriteria(criteria: Partner): Promise<Partner[]> {
    return this.repository.find({ where: criteria });
  }
  
  async create(entity: Partner): Promise<Partner> {
    const partner = this.repository.create(entity);
    return this.repository.save(partner);
  }

  async update(id: number, entity: Partial<Partner>): Promise<Partner> {
    await this.repository.update(id, entity);
    const updatedPartner = await this.repository.findOne({
      where: {
        id: id,
      },
    });
    return updatedPartner;
  }

  async delete(id: number): Promise<DeleteResult> {
    return this.repository.delete(id);
  }

  async softDelete(id: number): Promise<UpdateResult> {
    return this.repository.update(id, { deleted: true });
  }

  async restore(id: number): Promise<UpdateResult> {
    return this.repository.update(id, { deleted: false });
  }

  async count(criteria?: Partial<Partner>): Promise<number> {
    return this.repository.count({ where: criteria });
  }

  // Métodos específicos para Partner
  async findByName(name: string): Promise<Partner | null> {
    return this.repository.findOne({ where: { name } });
  }

  async findByEmail(email: string): Promise<Partner | null> {
    return this.repository.findOne({ where: { email: email, deleted: false, isActive: true } });
  }

  async findByToken(token: string): Promise<Partner | null> {
    return this.repository.findOne({ 
      where: { 
        token: token, 
        deleted: false, 
        isActive: true 
      } 
    });
  }

  async findByTokenAnyStatus(token: string): Promise<Partner | null> {
    return this.repository.findOne({ 
      where: { 
        token: token
      } 
    });
  }

  async findActivePartners(): Promise<Partner[]> {
    return this.repository.find({ where: { isActive: true } });
  }

  async deactivatePartner(id: number): Promise<void> {
    await this.repository.update(id, { isActive: false });
  }

  async activatePartner(id: number): Promise<void> {
    await this.repository.update(id, { isActive: true });
  }

  async updatePassword(id: number, hashedPassword: string): Promise<Partner> {
    await this.repository.update(id, { password: hashedPassword });
    return this.repository.findOne({ where: { id } });
  }
}
