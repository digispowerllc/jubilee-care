import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

interface SecurityHeadersConfig {
  frameOptions?: 'DENY' | 'SAMEORIGIN' | string;
  contentTypeOptions?: 'nosniff' | string;
  referrerPolicy?: 'strict-origin-when-cross-origin' | string;
  permissionsPolicy?: string;
  csp?: {
    defaultSrc?: string[];
    scriptSrc?: string[];
    styleSrc?: string[];
    imgSrc?: string[];
    fontSrc?: string[];
    connectSrc?: string[];
    frameSrc?: string[];
    objectSrc?: string[];
    baseUri?: string[];
    formAction?: string[];
    reportUri?: string;
    requireTrustedTypesFor?: string[];
    sandbox?: string[];
    upgradeInsecureRequests?: boolean;
    workerSrc?: string[];
  };
  reportOnly?: boolean;
}

const productionConfig: SecurityHeadersConfig = {
  frameOptions: 'DENY',
  contentTypeOptions: 'nosniff',
  referrerPolicy: 'strict-origin-when-cross-origin',
  permissionsPolicy: 'camera=(), microphone=(), geolocation=()',
  csp: {
    defaultSrc: ["'self'"],
    scriptSrc: [
      "'self'",
      "'unsafe-inline'",
      "'report-sample'"
    ],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", "data:", "blob:"],
    fontSrc: ["'self'", "data:"],
    connectSrc: ["'self'"],
    frameSrc: ["'none'"],
    objectSrc: ["'none'"],
    baseUri: ["'self'"],
    formAction: ["'self'"],
    workerSrc: ["'self'", "blob:"],
    upgradeInsecureRequests: true
  }
};

const developmentConfig: SecurityHeadersConfig = {
  ...productionConfig,
  csp: {
    ...productionConfig.csp,
    connectSrc: [
      "'self'",
      "ws://localhost:*",
      "ws://192.168.0.159:*",
      "http://localhost:*",
      "http://192.168.0.159:*"
    ],
    upgradeInsecureRequests: false
  }
};

export async function withSecurityHeaders(
  request: NextRequest,
  userConfig: Partial<SecurityHeadersConfig> = {}
) {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const baseConfig = isDevelopment ? developmentConfig : productionConfig;
  const config: SecurityHeadersConfig = { ...baseConfig, ...userConfig };

  const response = NextResponse.next();

  // Generate nonce for CSP
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');

  // Store nonce in request headers so it can be accessed in pages
  request.headers.set('x-nonce', nonce);

  // Set standard security headers
  if (config.frameOptions) {
    response.headers.set('X-Frame-Options', config.frameOptions);
  }

  if (config.contentTypeOptions) {
    response.headers.set('X-Content-Type-Options', config.contentTypeOptions);
  }

  if (config.referrerPolicy) {
    response.headers.set('Referrer-Policy', config.referrerPolicy);
  }

  if (config.permissionsPolicy) {
    response.headers.set('Permissions-Policy', config.permissionsPolicy);
  }

  // Generate CSP
  if (config.csp) {
    const cspDirectives: string[] = [];

    // Helper function to process CSP directives
    const processDirective = (directive: string, sources?: string[]) => {
      if (sources && sources.length > 0) {
        // Add nonce to script-src and style-src if they're the directives
        if (directive === 'script-src' && !sources.includes(`'nonce-${nonce}'`)) {
          sources.push(`'nonce-${nonce}'`);
        }
        if (directive === 'style-src' && !sources.includes(`'nonce-${nonce}'`)) {
          sources.push(`'nonce-${nonce}'`);
        }

        // Add integrity support for script-src
        if (directive === 'script-src' && !sources.includes("'strict-dynamic'")) {
          sources.push("'strict-dynamic'");
        }

        cspDirectives.push(`${directive} ${sources.join(' ')}`);
      }
    };

    // Process each CSP directive
    Object.entries(config.csp).forEach(([directive, sources]) => {
      if (directive === 'reportUri' || directive === 'requireTrustedTypesFor' ||
        directive === 'sandbox' || directive === 'upgradeInsecureRequests') {
        // Handle special cases
        if (directive === 'upgradeInsecureRequests' && sources) {
          cspDirectives.push('upgrade-insecure-requests');
        } else if (sources) {
          cspDirectives.push(`${directive.replace(/([A-Z])/g, '-$1').toLowerCase()} ${sources}`);
        }
      } else {
        processDirective(directive.replace(/([A-Z])/g, '-$1').toLowerCase(), sources as string[]);
      }
    });

    const cspHeader = config.reportOnly ? 'Content-Security-Policy-Report-Only' : 'Content-Security-Policy';
    response.headers.set(cspHeader, cspDirectives.join('; '));
  }

  if (isDevelopment) {
    console.debug('Security headers applied:', {
      'X-Frame-Options': response.headers.get('X-Frame-Options'),
      'X-Content-Type-Options': response.headers.get('X-Content-Type-Options'),
      'Referrer-Policy': response.headers.get('Referrer-Policy'),
      'Permissions-Policy': response.headers.get('Permissions-Policy'),
      'Content-Security-Policy': response.headers.get('Content-Security-Policy') ||
        response.headers.get('Content-Security-Policy-Report-Only'),
      environment: 'development'
    });
  }

  return response;
}

// Production-ready security headers configuration
export const securityHeadersConfig = {
  frameOptions: 'DENY',
  contentTypeOptions: 'nosniff',
  referrerPolicy: 'strict-origin-when-cross-origin',
  permissionsPolicy: 'camera=(), microphone=(), geolocation=(), payment=()',

  csp: {
    defaultSrc: ["'self'"], // Changed from 'none' to 'self' for Next.js
    scriptSrc: [
      "'self'",
      "'unsafe-inline'",
      "'unsafe-eval'", // Required for Next.js in production
      "'report-sample'",
      "https://*.vercel.app", // Add if using Vercel
    ],
    styleSrc: [
      "'self'",
      "'unsafe-inline'", // Required for Next.js
      "https://fonts.googleapis.com",
      "https://*.vercel.app" // Add if using Vercel
    ],
    imgSrc: [
      "'self'",
      "data:",
      "blob:",
      "https://*.google-analytics.com",
      "https://*.googletagmanager.com",
      "https://*.vercel.com",
      "https://*.vercel.app",
      "https://*.cloudinary.com",
      "https://ui-avatars.com",
      "https://cdn.prod.website-files.com"
      // Add if using Cloudinary
    ],
    fontSrc: [
      "'self'",
      "data:",
      "https://fonts.gstatic.com",
      "https://*.vercel.app" // Add if using Vercel
    ],
    connectSrc: [
      "'self'",
      "https://*.google-analytics.com",
      "https://*.analytics.google.com",
      "https://*.vercel-insights.com",
      "https://*.vercel.app", // Add if using Vercel
      "wss://*.vercel.app" // For WebSockets
    ],
    frameSrc: ["'self'"],
    mediaSrc: ["'self'"],
    manifestSrc: ["'self'"],
    objectSrc: ["'none'"],
    baseUri: ["'self'"],
    formAction: ["'self'"],
    workerSrc: ["'self'", "blob:"], // Required for Next.js
    childSrc: ["'self'"], // Fallback for older browsers
    // reportUri: "/api/csp-report", // Uncomment when ready
    upgradeInsecureRequests: false, //
    blockAllMixedContent: true
  }
};

// import type { NextRequest } from 'next/server';
// import { NextResponse } from 'next/server';

// interface SecurityHeadersConfig {
//   frameOptions?: 'DENY' | 'SAMEORIGIN' | string;
//   contentTypeOptions?: 'nosniff' | string;
//   referrerPolicy?: 'strict-origin-when-cross-origin' | string;
//   permissionsPolicy?: string;
//   csp?: {
//     defaultSrc?: string[];
//     scriptSrc?: string[];
//     styleSrc?: string[];
//     imgSrc?: string[];
//     fontSrc?: string[];
//     connectSrc?: string[];
//     frameSrc?: string[];
//     objectSrc?: string[];
//     baseUri?: string[];
//     formAction?: string[];
//     reportUri?: string;
//     requireTrustedTypesFor?: string[];
//     sandbox?: string[];
//     upgradeInsecureRequests?: boolean;
//   };
//   reportOnly?: boolean;
// }

// const defaultConfig: SecurityHeadersConfig = {
//   frameOptions: 'DENY',
//   contentTypeOptions: 'nosniff',
//   referrerPolicy: 'strict-origin-when-cross-origin',
//   permissionsPolicy: 'camera=(), microphone=(), geolocation=()',
//   csp: {
//     defaultSrc: ["'self'"],
//     scriptSrc: ["'self'", "'unsafe-inline'", "https:"],
//     styleSrc: ["'self'", "'unsafe-inline'"],
//     imgSrc: ["'self'", "data:"],
//     fontSrc: ["'self'"],
//     connectSrc: ["'self'"],
//     frameSrc: ["'none'"],
//     objectSrc: ["'none'"],
//     baseUri: ["'self'"],
//     formAction: ["'self'"],
//   },
// };

// export async function withSecurityHeaders(
//   request: NextRequest,
//   userConfig: Partial<SecurityHeadersConfig> = {}
// ) {
//   const config: SecurityHeadersConfig = { ...defaultConfig, ...userConfig };
//   const response = NextResponse.next();

//   // Set standard security headers
//   if (config.frameOptions) {
//     response.headers.set('X-Frame-Options', config.frameOptions);
//   }

//   if (config.contentTypeOptions) {
//     response.headers.set('X-Content-Type-Options', config.contentTypeOptions);
//   }

//   if (config.referrerPolicy) {
//     response.headers.set('Referrer-Policy', config.referrerPolicy);
//   }

//   if (config.permissionsPolicy) {
//     response.headers.set('Permissions-Policy', config.permissionsPolicy);
//   }

//   // Generate CSP
//   if (config.csp) {
//     const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
//     const cspDirectives: string[] = [];

//     // Helper function to process CSP directives
//     const processDirective = (directive: string, sources?: string[]) => {
//       if (sources && sources.length > 0) {
//         // Add nonce to script-src if it's the directive
//         if (directive === 'script-src' && !sources.includes(`'nonce-${nonce}'`)) {
//           sources.push(`'nonce-${nonce}'`);
//         }
//         cspDirectives.push(`${directive} ${sources.join(' ')}`);
//       }
//     };

//     // Process each CSP directive
//     Object.entries(config.csp).forEach(([directive, sources]) => {
//       if (directive === 'reportUri' || directive === 'requireTrustedTypesFor' ||
//         directive === 'sandbox' || directive === 'upgradeInsecureRequests') {
//         // Handle special cases
//         if (directive === 'upgradeInsecureRequests' && sources) {
//           cspDirectives.push('upgrade-insecure-requests');
//         } else if (sources) {
//           cspDirectives.push(`${directive.replace(/([A-Z])/g, '-$1').toLowerCase()} ${sources}`);
//         }
//       } else {
//         processDirective(directive.replace(/([A-Z])/g, '-$1').toLowerCase(), sources as string[]);
//       }
//     });

//     const cspHeader = config.reportOnly ? 'Content-Security-Policy-Report-Only' : 'Content-Security-Policy';
//     response.headers.set(cspHeader, cspDirectives.join('; '));
//   }

//   console.log('Security headers applied:', {
//     'X-Frame-Options': response.headers.get('X-Frame-Options'),
//     'X-Content-Type-Options': response.headers.get('X-Content-Type-Options'),
//     'Referrer-Policy': response.headers.get('Referrer-Policy'),
//     'Permissions-Policy': response.headers.get('Permissions-Policy'),
//     'Content-Security-Policy': response.headers.get('Content-Security-Policy') ||
//       response.headers.get('Content-Security-Policy-Report-Only'),
//   });

//   return response;
// }