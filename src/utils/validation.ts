// Form validation utilities

export interface ValidationRule {
  message: string;
  test: (value: any) => boolean;
}

export interface ValidationSchema {
  [key: string]: ValidationRule[];
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Common validation rules
 */
export const validationRules = {
  required: (message: string = "Este campo es requerido"): ValidationRule => ({
    message,
    test: (value) => value !== undefined && value !== null && value !== '',
  }),

  email: (message: string = "Ingresa un email válido"): ValidationRule => ({
    message,
    test: (value) => {
      if (!value) return true; // Allow empty if not required
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value);
    },
  }),

  phone: (message: string = "Ingresa un teléfono válido"): ValidationRule => ({
    message,
    test: (value) => {
      if (!value) return true; // Allow empty if not required
      const phoneRegex = /^(\+54|54|0)?9?[1-9]\d{8,9}$/;
      return phoneRegex.test(value.replace(/\s|-/g, ''));
    },
  }),

  minLength: (min: number, message?: string): ValidationRule => ({
    message: message || `Debe tener al menos ${min} caracteres`,
    test: (value) => !value || value.length >= min,
  }),

  maxLength: (max: number, message?: string): ValidationRule => ({
    message: message || `Debe tener máximo ${max} caracteres`,
    test: (value) => !value || value.length <= max,
  }),

  min: (min: number, message?: string): ValidationRule => ({
    message: message || `El valor mínimo es ${min}`,
    test: (value) => !value || Number(value) >= min,
  }),

  max: (max: number, message?: string): ValidationRule => ({
    message: message || `El valor máximo es ${max}`,
    test: (value) => !value || Number(value) <= max,
  }),

  pattern: (regex: RegExp, message: string): ValidationRule => ({
    message,
    test: (value) => !value || regex.test(value),
  }),

  url: (message: string = "Ingresa una URL válida"): ValidationRule => ({
    message,
    test: (value) => {
      if (!value) return true;
      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    },
  }),
};

/**
 * Validate a single field
 */
export function validateField(value: any, rules: ValidationRule[]): string | null {
  for (const rule of rules) {
    if (!rule.test(value)) {
      return rule.message;
    }
  }
  return null;
}

/**
 * Validate an entire form object
 */
export function validateForm(data: Record<string, any>, schema: ValidationSchema): ValidationResult {
  const errors: Record<string, string> = {};
  let isValid = true;

  for (const [field, rules] of Object.entries(schema)) {
    const error = validateField(data[field], rules);
    if (error) {
      errors[field] = error;
      isValid = false;
    }
  }

  return { isValid, errors };
}

/**
 * Contact form validation schema
 */
export const contactFormSchema: ValidationSchema = {
  name: [
    validationRules.required("El nombre es requerido"),
    validationRules.minLength(2, "El nombre debe tener al menos 2 caracteres"),
    validationRules.maxLength(50, "El nombre no puede tener más de 50 caracteres"),
  ],
  email: [
    validationRules.required("El email es requerido"),
    validationRules.email(),
  ],
  phone: [
    validationRules.required("El teléfono es requerido"),
    validationRules.phone(),
  ],
  company: [
    validationRules.maxLength(100, "El nombre de la empresa no puede tener más de 100 caracteres"),
  ],
  dailyDeliveries: [
    validationRules.required("El número de envíos diarios es requerido"),
    validationRules.min(1, "Debe tener al menos 1 envío diario"),
    validationRules.max(1000, "El máximo son 1000 envíos diarios"),
  ],
  zone: [
    validationRules.required("Selecciona una zona de cobertura"),
  ],
  message: [
    validationRules.maxLength(500, "El mensaje no puede tener más de 500 caracteres"),
  ],
};

/**
 * Quote request validation schema
 */
export const quoteFormSchema: ValidationSchema = {
  name: [
    validationRules.required("El nombre es requerido"),
    validationRules.minLength(2),
    validationRules.maxLength(50),
  ],
  email: [
    validationRules.required("El email es requerido"),
    validationRules.email(),
  ],
  phone: [
    validationRules.required("El teléfono es requerido"),
    validationRules.phone(),
  ],
  businessName: [
    validationRules.required("El nombre del negocio es requerido"),
    validationRules.maxLength(100),
  ],
  dailyVolume: [
    validationRules.required("El volumen diario es requerido"),
    validationRules.min(1),
  ],
  zones: [
    validationRules.required("Selecciona al menos una zona"),
  ],
  mercadoLibreStore: [
    validationRules.url("Ingresa una URL válida de Mercado Libre"),
  ],
};

/**
 * Newsletter subscription validation schema
 */
export const newsletterSchema: ValidationSchema = {
  email: [
    validationRules.required("El email es requerido"),
    validationRules.email(),
  ],
};