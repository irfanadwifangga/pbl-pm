// Security Configuration
export const SECURITY_CONFIG = {
  // Rate limiting for API endpoints (requests per minute)
  rateLimit: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 100,
  },

  // Session configuration
  session: {
    maxAge: 24 * 60 * 60, // 24 hours
    updateAge: 60 * 60, // 1 hour
  },

  // Password requirements
  password: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: false,
  },

  // File upload restrictions
  upload: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ["image/jpeg", "image/png", "image/webp", "application/pdf"],
  },
};

// Application Configuration
export const APP_CONFIG = {
  name: "Sistem Peminjaman Ruangan Polinela",
  shortName: "Peminjaman Polinela",
  description: "Sistem manajemen peminjaman ruangan gedung Politeknik Negeri Lampung",
  url: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  locale: "id-ID",
  timezone: "Asia/Jakarta",
};
