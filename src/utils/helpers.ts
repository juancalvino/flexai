import { SELLER_TIERS, COVERAGE_ZONES } from './constants';

/**
 * Format currency in Argentine Pesos
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format phone number for display
 */
export function formatPhoneNumber(phone: string): string {
  // Remove country code and format as XX XXXX-XXXX
  const cleaned = phone.replace(/\D/g, '').replace(/^549/, '');
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
}

/**
 * Get seller tier based on daily deliveries
 */
export function getSellerTier(dailyDeliveries: number) {
  if (dailyDeliveries >= 100) {
    return SELLER_TIERS.BEST;
  } else if (dailyDeliveries >= 50) {
    return SELLER_TIERS.PRO;
  } else {
    return SELLER_TIERS.STANDARD;
  }
}

/**
 * Calculate price with VAT
 */
export function calculatePriceWithVAT(basePrice: number, includeVAT: boolean = false): number {
  return includeVAT ? Math.round(basePrice * 1.21) : basePrice;
}

/**
 * Get price estimate for a zone and delivery volume
 */
export function getPriceEstimate(
  zone: keyof typeof COVERAGE_ZONES,
  dailyDeliveries: number,
  includeVAT: boolean = false
) {
  const tier = getSellerTier(dailyDeliveries);
  const basePrice = tier.prices[zone];
  const finalPrice = calculatePriceWithVAT(basePrice, includeVAT);
  
  return {
    tier: tier.name,
    basePrice,
    finalPrice,
    currency: formatCurrency(finalPrice)
  };
}

/**
 * Generate WhatsApp message URL
 */
export function generateWhatsAppUrl(
  phone: string = "+5491130502881",
  message: string = "Hola! Me interesa conocer más sobre los servicios de FLEXAI."
): string {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodedMessage}`;
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number (Argentine format)
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^(\+54|54|0)?9?[1-9]\d{8,9}$/;
  return phoneRegex.test(phone.replace(/\s|-/g, ''));
}

/**
 * Slugify string for URLs
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9 -]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/-+/g, '-') // Replace multiple - with single -
    .trim();
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

/**
 * Format delivery time range
 */
export function formatDeliveryTime(startHour: number, endHour: number): string {
  const formatHour = (hour: number) => {
    return hour.toString().padStart(2, '0') + ':00';
  };
  
  return `${formatHour(startHour)} - ${formatHour(endHour)}`;
}

/**
 * Calculate business days between dates (excluding weekends)
 */
export function getBusinessDaysBetween(startDate: Date, endDate: Date): number {
  let count = 0;
  const current = new Date(startDate);
  
  while (current <= endDate) {
    const dayOfWeek = current.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Not Sunday (0) or Saturday (6)
      count++;
    }
    current.setDate(current.getDate() + 1);
  }
  
  return count;
}

/**
 * Check if current time is within business hours
 */
export function isWithinBusinessHours(now: Date = new Date()): boolean {
  const day = now.getDay(); // 0 = Sunday, 6 = Saturday
  const hour = now.getHours();
  
  // Monday to Saturday, 9 AM to 10 PM
  return day >= 1 && day <= 6 && hour >= 9 && hour < 22;
}