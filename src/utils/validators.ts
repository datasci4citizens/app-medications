
import type { Medication } from '../types';

// ============================================
// VALIDATORS - Funções de Validação
// ============================================

/**
 * Por que usar validators?
 * 
 * 1. Código reutilizável
 * 2. Mensagens de erro consistentes
 * 3. Fácil de testar
 * 4. Fácil de adicionar novas regras
 */

// ============================================
// TIPOS DE RETORNO
// ============================================

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

// ============================================
// VALIDADORES BÁSICOS
// ============================================

export const validators = {
  /**
   * Valida se string não está vazia
   */
  required: (value: string | undefined | null): boolean => {
    return !!value && value.trim().length > 0;
  },

  /**
   * Valida email
   */
  email: (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  },

  /**
   * Valida tamanho mínimo
   */
  minLength: (value: string, min: number): boolean => {
    return value.length >= min;
  },

  /**
   * Valida tamanho máximo
   */
  maxLength: (value: string, max: number): boolean => {
    return value.length <= max;
  },

  /**
   * Valida se é número
   */
  isNumber: (value: string): boolean => {
    return !isNaN(Number(value));
  },

  /**
   * Valida formato de horário (HH:MM)
   */
  isValidTime: (value: string): boolean => {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(value);
  },

  /**
   * Valida formato de data (YYYY-MM-DD)
   */
  isValidDate: (value: string): boolean => {
    const date = new Date(value);
    return date instanceof Date && !isNaN(date.getTime());
  },
};

// ============================================
// VALIDADORES ESPECÍFICOS DO APP
// ============================================

/**
 * Valida formulário de medicamento
 */
export function validateMedicationForm(data: Partial<Medication>): ValidationResult {
  const errors: Record<string, string> = {};

  // Nome obrigatório
  if (!validators.required(data.name)) {
    errors.name = 'Nome do medicamento é obrigatório';
  } else if (!validators.minLength(data.name!, 2)) {
    errors.name = 'Nome deve ter pelo menos 2 caracteres';
  } else if (!validators.maxLength(data.name!, 100)) {
    errors.name = 'Nome deve ter no máximo 100 caracteres';
  }

  // Dosagem obrigatória
  if (!validators.required(data.dosage)) {
    errors.dosage = 'Dosagem é obrigatória';
  }

  // Horário obrigatório e válido
  if (!validators.required(data.time)) {
    errors.time = 'Horário é obrigatório';
  } else if (!validators.isValidTime(data.time!)) {
    errors.time = 'Horário inválido (use formato HH:MM)';
  }

  // Data opcional, mas se preenchida deve ser válida
  if (data.scheduledDate && !validators.isValidDate(data.scheduledDate)) {
    errors.scheduledDate = 'Data inválida';
  }

  // Marca opcional, mas com limite de caracteres
  if (data.brand && !validators.maxLength(data.brand, 50)) {
    errors.brand = 'Marca deve ter no máximo 50 caracteres';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Valida formulário de cadastro de usuário
 */
export function validateRegisterForm(data: {
  name?: string;
  email?: string;
  birthDate?: string;
}): ValidationResult {
  const errors: Record<string, string> = {};

  // Nome obrigatório
  if (!validators.required(data.name)) {
    errors.name = 'Nome é obrigatório';
  } else if (!validators.minLength(data.name!, 3)) {
    errors.name = 'Nome deve ter pelo menos 3 caracteres';
  }

  // Email obrigatório e válido
  if (!validators.required(data.email)) {
    errors.email = 'Email é obrigatório';
  } else if (!validators.email(data.email!)) {
    errors.email = 'Email inválido';
  }

  // Data de nascimento opcional, mas se preenchida deve ser válida
  if (data.birthDate) {
    if (!validators.isValidDate(data.birthDate)) {
      errors.birthDate = 'Data de nascimento inválida';
    } else {
      // Verifica se não é data futura
      const birthDate = new Date(data.birthDate);
      const today = new Date();
      if (birthDate > today) {
        errors.birthDate = 'Data de nascimento não pode ser no futuro';
      }

      // Verifica se tem mais de 120 anos
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age > 120) {
        errors.birthDate = 'Data de nascimento inválida';
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Valida busca
 */
export function validateSearchQuery(query: string): boolean {
  // Busca deve ter pelo menos 2 caracteres
  return validators.minLength(query.trim(), 2);
}

/**
 * Sanitiza string (remove caracteres especiais perigosos)
 */
export function sanitizeString(value: string): string {
  return value
    .replace(/[<>]/g, '') // Remove < e >
    .trim();
}

/**
 * Valida e sanitiza input
 */
export function sanitizeInput(value: string): string {
  return sanitizeString(value);
}