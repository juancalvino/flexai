import { generateWhatsAppUrl } from '../utils/helpers';
import { BUSINESS_INFO } from '../utils/constants';

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  company?: string;
  dailyDeliveries: number;
  zone: string;
  message?: string;
}

export interface QuoteFormData {
  name: string;
  email: string;
  phone: string;
  businessName: string;
  dailyVolume: number;
  zones: string[];
  mercadoLibreStore?: string;
  additionalInfo?: string;
}

export interface FormSubmissionResult {
  success: boolean;
  message: string;
  redirectUrl?: string;
}

/**
 * Contact form service
 */
export class ContactService {
  /**
   * Submit contact form
   */
  static async submitContactForm(data: ContactFormData): Promise<FormSubmissionResult> {
    try {
      // Create WhatsApp message
      const message = this.createContactMessage(data);
      const whatsappUrl = generateWhatsAppUrl(BUSINESS_INFO.whatsapp, message);
      
      // In a real app, you might also send to a backend API
      // await this.sendToAPI(data);
      
      return {
        success: true,
        message: "¡Mensaje preparado! Te redirigiremos a WhatsApp para enviarlo.",
        redirectUrl: whatsappUrl
      };
    } catch (error) {
      console.error('Error submitting contact form:', error);
      return {
        success: false,
        message: "Hubo un error al procesar tu solicitud. Por favor intenta nuevamente."
      };
    }
  }

  /**
   * Submit quote request form
   */
  static async submitQuoteForm(data: QuoteFormData): Promise<FormSubmissionResult> {
    try {
      const message = this.createQuoteMessage(data);
      const whatsappUrl = generateWhatsAppUrl(BUSINESS_INFO.whatsapp, message);
      
      return {
        success: true,
        message: "¡Cotización preparada! Te redirigiremos a WhatsApp para enviarla.",
        redirectUrl: whatsappUrl
      };
    } catch (error) {
      console.error('Error submitting quote form:', error);
      return {
        success: false,
        message: "Hubo un error al procesar tu cotización. Por favor intenta nuevamente."
      };
    }
  }

  /**
   * Create contact WhatsApp message
   */
  private static createContactMessage(data: ContactFormData): string {
    let message = `🚚 *Consulta sobre servicios FLEXAI*\n\n`;
    message += `👤 *Nombre:* ${data.name}\n`;
    message += `📧 *Email:* ${data.email}\n`;
    message += `📱 *Teléfono:* ${data.phone}\n`;
    
    if (data.company) {
      message += `🏢 *Empresa:* ${data.company}\n`;
    }
    
    message += `📦 *Envíos diarios:* ${data.dailyDeliveries}\n`;
    message += `📍 *Zona principal:* ${data.zone}\n`;
    
    if (data.message) {
      message += `💬 *Mensaje:* ${data.message}\n`;
    }
    
    message += `\n¡Hola! Me interesa conocer más sobre los servicios de logística de FLEXAI.`;
    
    return message;
  }

  /**
   * Create quote WhatsApp message
   */
  private static createQuoteMessage(data: QuoteFormData): string {
    let message = `💰 *Solicitud de Cotización FLEXAI*\n\n`;
    message += `👤 *Nombre:* ${data.name}\n`;
    message += `📧 *Email:* ${data.email}\n`;
    message += `📱 *Teléfono:* ${data.phone}\n`;
    message += `🏢 *Negocio:* ${data.businessName}\n`;
    message += `📦 *Volumen diario:* ${data.dailyVolume} envíos\n`;
    message += `📍 *Zonas de interés:* ${data.zones.join(', ')}\n`;
    
    if (data.mercadoLibreStore) {
      message += `🛒 *Tienda ML:* ${data.mercadoLibreStore}\n`;
    }
    
    if (data.additionalInfo) {
      message += `📝 *Info adicional:* ${data.additionalInfo}\n`;
    }
    
    message += `\nHola! Me gustaría recibir una cotización personalizada para mi negocio.`;
    
    return message;
  }

  /**
   * Subscribe to newsletter
   */
  static async subscribeNewsletter(email: string): Promise<FormSubmissionResult> {
    try {
      // In a real app, you would integrate with an email service
      // await emailService.subscribe(email);
      
      console.log(`Newsletter subscription: ${email}`);
      
      return {
        success: true,
        message: "¡Suscripción exitosa! Recibirás noticias y ofertas especiales."
      };
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      return {
        success: false,
        message: "Error al suscribirse. Por favor intenta nuevamente."
      };
    }
  }

  /**
   * Send to backend API (placeholder)
   */
  private static async sendToAPI(data: any): Promise<void> {
    // This would be implemented with your backend API
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }
  }
}

/**
 * Analytics service for tracking form interactions
 */
export class AnalyticsService {
  /**
   * Track form submission
   */
  static trackFormSubmission(formType: string, success: boolean): void {
    // Integration with analytics platforms
    try {
      // Google Analytics 4
      if (typeof gtag !== 'undefined') {
        gtag('event', 'form_submit', {
          form_type: formType,
          success: success,
        });
      }

      // Vercel Analytics
      if (typeof va !== 'undefined') {
        va.track('Form Submission', {
          type: formType,
          success: success,
        });
      }
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  }

  /**
   * Track button clicks
   */
  static trackButtonClick(buttonName: string, location: string): void {
    try {
      if (typeof gtag !== 'undefined') {
        gtag('event', 'click', {
          button_name: buttonName,
          location: location,
        });
      }

      if (typeof va !== 'undefined') {
        va.track('Button Click', {
          name: buttonName,
          location: location,
        });
      }
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  }

  /**
   * Track page views
   */
  static trackPageView(pageName: string): void {
    try {
      if (typeof gtag !== 'undefined') {
        gtag('event', 'page_view', {
          page_title: pageName,
        });
      }
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  }
}