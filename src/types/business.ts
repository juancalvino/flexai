// Business domain types for FLEXAI

export type CoverageZone = 'CABA' | 'GBA1' | 'GBA2' | 'GBA3';

export type SellerTierType = 'STANDARD' | 'PRO' | 'BEST';

export interface BusinessInfo {
  readonly name: string;
  readonly fullName: string;
  readonly tagline: string;
  readonly phone: string;
  readonly email: string;
  readonly website: string;
  readonly lightDataUrl: string;
  readonly instagram: string;
  readonly whatsapp: string;
}

export interface SellerTier {
  readonly name: string;
  readonly description: string;
  readonly minDeliveries: number;
  readonly maxDeliveries: number | null;
  readonly features: readonly string[];
  readonly prices: Record<CoverageZone, number>;
}

export interface ServiceFeature {
  readonly title: string;
  readonly description: string;
  readonly icon: string;
}

export interface PriceEstimate {
  readonly tier: string;
  readonly basePrice: number;
  readonly finalPrice: number;
  readonly currency: string;
}

export interface OperatingHours {
  readonly collection: string;
  readonly delivery: string;
  readonly support: string;
}

// Form related types
export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  company?: string;
  dailyDeliveries: number;
  zone: CoverageZone;
  message?: string;
}

export interface QuoteFormData {
  name: string;
  email: string;
  phone: string;
  businessName: string;
  dailyVolume: number;
  zones: CoverageZone[];
  mercadoLibreStore?: string;
  additionalInfo?: string;
}

export interface NewsletterData {
  email: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string>;
}

export interface FormSubmissionResult {
  success: boolean;
  message: string;
  redirectUrl?: string;
}

// Validation types
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

// UI Component types
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

export type CardVariant = 'default' | 'elevated' | 'outline' | 'glass' | 'gradient';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg' | 'xl';

export type BadgeVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
export type BadgeSize = 'sm' | 'md' | 'lg';

export type InputSize = 'sm' | 'md' | 'lg';

// Navigation types
export interface MenuItem {
  title: string;
  path: string;
  badge?: string;
  external?: boolean;
}

export interface NavigationLink {
  name: string;
  href: string;
  external?: boolean;
}

export interface SocialLink {
  name: string;
  href: string;
  icon: string;
}

// SEO and Meta types
export interface SeoData {
  title: string;
  description: string;
  canonical?: string;
  image?: string;
  type?: 'website' | 'article';
  locale?: string;
  siteName?: string;
}

// Analytics types
export interface AnalyticsEvent {
  name: string;
  parameters?: Record<string, string | number | boolean>;
}

export interface TrackingData {
  event: string;
  category?: string;
  action?: string;
  label?: string;
  value?: number;
}

// Utility types
export type Maybe<T> = T | null | undefined;
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Error types
export interface AppError {
  code: string;
  message: string;
  details?: Record<string, any>;
}