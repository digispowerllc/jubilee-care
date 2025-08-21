// File: src/lib/security/cspConfig.ts
 // CSP without nonce
  export const cspConfig = {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'report-sample'", "https://*.vercel.app"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: [
      "'self'",
      "data:",
      "blob:",
      "https://ui-avatars.com",
      "https://res.cloudinary.com",
      "https://*.cloudinary.com/",
    ],
    fontSrc: ["'self'", "data:"],
    connectSrc: ["'self'", "https://*.vercel.app"],
    frameSrc: ["'self'"],
    objectSrc: ["'none'"],
    baseUri: ["'self'"],
    formAction: ["'self'"],
  };
