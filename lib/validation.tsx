// lib/validation.tsx
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

  if (data.originalPrice && !validator.isFloat(data.originalPrice.toString(), { min: 0 })) {
    errors.push('Исходная цена должна быть положительным числом');
  }

  if (!data.description || data.description.trim().length < 10) {
    errors.push('Описание должно содержать минимум 10 символов');
  }

  if (!data.category) {
    errors.push('Необходимо выбрать категорию');
  }

  if (!data.brand || data.brand.trim().length < 2) {
    errors.push('Бренд должен содержать минимум 2 символа');
  }

  if (!data.sku || data.sku.trim().length < 3) {
    errors.push('SKU должен содержать минимум 3 символа');
  }

  if (!data.slug || data.slug.trim().length < 2) {
    errors.push('Slug должен содержать минимум 2 символа');
  }

  // Валидация размеров
  if (data.sizes && Array.isArray(data.sizes)) {
    data.sizes.forEach((size: any, index: number) => {
      if (!size.size || size.size.trim().length === 0) {
        errors.push(`Размер #${index + 1} не может быть пустым`);
      }
      if (typeof size.stockQuantity !== 'number' || size.stockQuantity < 0) {
        errors.push(`Количество для размера "${size.size}" должно быть неотрицательным числом`);
      }
    });
  }

  // Валидация цветов
  if (data.colors && Array.isArray(data.colors)) {
    data.colors.forEach((color: any, index: number) => {
      if (!color.name || color.name.trim().length === 0) {
        errors.push(`Название цвета #${index + 1} не может быть пустым`);
      }
      if (!color.value || !validator.isHexColor(color.value)) {
        errors.push(`Цвет #${index + 1} должен быть в формате HEX`);
      }
    });
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

export function validateUserUpdate(data: any): ValidationResult {
  const errors: string[] = [];

  if (data.email && !validator.isEmail(data.email)) {
    errors.push('Некорректный email адрес');
  }

  if (data.password && !validator.isLength(data.password, { min: 6 })) {
    errors.push('Пароль должен содержать минимум 6 символов');
  }

  if (data.name && !validator.isLength(data.name, { min: 2 })) {
    errors.push('Имя должно содержать минимум 2 символа');
  }

  if (data.role && !['user', 'admin'].includes(data.role)) {
    errors.push('Некорректная роль пользователя');
  }

  if (data.active !== undefined && typeof data.active !== 'boolean') {
    errors.push('Статус активности должен быть boolean');
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
    errors.push('Необходимо указать адрес доставки (улица, дом)');
  }

  if (!data.email || !validator.isEmail(data.email)) {
    errors.push('Некорректный email адрес');
  }

  if (!data.phone || !validator.isMobilePhone(data.phone, 'any')) {
    errors.push('Некорректный номер телефона');
  }

  if (!data.firstName || data.firstName.trim().length < 2) {
    errors.push('Имя должно содержать минимум 2 символа');
  }

  if (!data.lastName || data.lastName.trim().length < 2) {
    errors.push('Фамилия должна содержать минимум 2 символа');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function sanitizeInput(input: string): string {
  return validator.escape(validator.trim(input));
}