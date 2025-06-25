import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("tbl_partners")
export class Partner {
  @PrimaryGeneratedColumn({ name: "partner_id" })
  id: number;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @Column("text")
  password: string;

  @Column({ name: "name" })
  name: string;

  @Column({ name: "lastname" })
  lastname: string;

  @Column({ name: "email" })
  email: string;

  @Column({ name: "token" })
  token: string;

  @Column({ name: "is_active" })
  isActive: boolean;

  @Column({ name: "deleted" })
  deleted: boolean;
}
