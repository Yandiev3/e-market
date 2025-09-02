import validator from 'validator';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateProduct(data: any): ValidationResult {
  const errors: string[] = [];

  if (!data.name || data.name.trim().length < 2) {
    errors.push('Название товара должно содержать минимум 2 символа');
  }

  if (!data.price || !validator.isFloat(data.price.toString(), { min: 0 })) {
    errors.push('Цена должна быть положительным числом');
  }

  if (data.description && data.description.length > 1000) {
    errors.push('Описание не должно превышать 1000 символов');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateUser(data: any): ValidationResult {
  const errors: string[] = [];

  if (!data.email || !validator.isEmail(data.email)) {
    errors.push('Некорректный email адрес');
  }

  if (!data.password || !validator.isLength(data.password, { min: 6 })) {
    errors.push('Пароль должен содержать минимум 6 символов');
  }

  if (data.name && !validator.isLength(data.name, { min: 2 })) {
    errors.push('Имя должно содержать минимум 2 символа');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateOrder(data: any): ValidationResult {
  const errors: string[] = [];

  if (!data.items || !Array.isArray(data.items) || data.items.length === 0) {
    errors.push('Заказ должен содержать хотя бы один товар');
  }

  if (!data.shippingAddress || !data.shippingAddress.street) {
    errors.push('Необходимо указать адрес доставки');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function sanitizeInput(input: string): string {
  return validator.escape(validator.trim(input));
}