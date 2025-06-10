// Configuración de seguridad para desarrollo
export const securityConfig = {
  // Configuración del servidor de desarrollo
  server: {
    // Solo permitir conexiones desde localhost
    host: 'localhost',
    // Puerto específico
    port: 4321,
    // Configuración CORS restrictiva
    cors: {
      origin: ['http://localhost:4321', 'http://127.0.0.1:4321'],
      credentials: false,
      methods: ['GET', 'POST'],
    },
    // Headers de seguridad
    headers: {
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin'
    }
  },
  
  // Configuración de Vite para desarrollo seguro
  vite: {
    server: {
      // Configuración CORS restrictiva
      cors: {
        origin: ['http://localhost:4321', 'http://127.0.0.1:4321'],
        credentials: false
      },
      // Restringir acceso a archivos
      fs: {
        strict: true,
        deny: ['.env', '.env.*', '**/.git/**']
      }
    }
  }
};