import { Expose } from "class-transformer";
import { IsNotEmpty, IsString, IsOptional } from "class-validator";

export class CreatePartnerDto {
  @IsNotEmpty()
  @IsString()
  @Expose()
  name: string;

  @IsNotEmpty()
  @IsString()
  @Expose({ name: "lastname" })
  lastname: string;

  @IsNotEmpty()
  @IsString()
  @Expose({ name: "email" })
  email: string;

  @IsNotEmpty()
  @IsString()
  @Expose()
  password: string;
}

export class UpdatePartnerDto {
  @IsNotEmpty()
  @Expose()
  id: number;

  @IsString()
  @Expose()
  @IsOptional()
  name?: string;

  @IsString()
  @Expose()
  @IsOptional()
  email?: string;

  @IsString()
  @Expose()
  @IsOptional()
  lastname?: string;

  @IsOptional()
  @IsString()
  @Expose()
  token?: string;
}
