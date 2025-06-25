import { randomBytes } from 'crypto';

/**
 * Genera un token único para partners
 * @returns string - Token único de 32 caracteres hexadecimales
 */
export function generatePartnerToken(): string {
  return randomBytes(16).toString('hex');
}

/**
 * Genera un token con prefijo personalizado
 * @param prefix - Prefijo para el token (ej: "PARTNER_")
 * @returns string - Token con prefijo + 32 caracteres hexadecimales
 */
export function generatePartnerTokenWithPrefix(prefix: string = "PARTNER_"): string {
  return prefix + randomBytes(16).toString('hex');
} 