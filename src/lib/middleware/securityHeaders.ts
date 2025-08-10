// lib/security.ts
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
    sandbox?: string[];
    upgradeInsecureRequests?: boolean;
    workerSrc?: string[];
    mediaSrc?: string[];
    manifestSrc?: string[];
    childSrc?: string[];
    blockAllMixedContent?: boolean;
  };
  reportOnly?: boolean;
}

/**
 * Default production config
 *
 * NOTE: This version intentionally DOES NOT add 'strict-dynamic' and does NOT
 * automatically require nonces. This makes host-based allowlisting (like
 * https://*.vercel.app and your own domain) effective for Next.js runtime chunks.
 */
const productionConfig: SecurityHeadersConfig = {
  frameOptions: 'DENY',
  contentTypeOptions: 'nosniff',
  referrerPolicy: 'strict-origin-when-cross-origin',
  permissionsPolicy: 'camera=(), microphone=(), geolocation=(), payment=()',
  csp: {
    defaultSrc: ["'self'"],
    // Allow Next.js scripts from same origin and Vercel hosts (if deployed)
    scriptSrc: [
      "'self'",
      // Keep 'unsafe-eval' off in production unless you truly need it.
      // Next.js sometimes requires it in dev only.
      //"'unsafe-eval'",
      "'report-sample'",
      'https://*.vercel.app',
      'https://*.vercel.com',
      // add your deployed domain(s)
      'https://jcic.vercel.app',
      // Next.js chunks live under /_next - same origin allowed by 'self'
    ],
    styleSrc: [
      "'self'",
      "'unsafe-inline'", // keep if you use inline styles (e.g., styled components SSR or critical CSS)
      'https://fonts.googleapis.com',
      'https://*.vercel.app',
      'https://jcic.vercel.app'
    ],
    imgSrc: [
      "'self'",
      'data:',
      'blob:',
      'https://*.google-analytics.com',
      'https://*.googletagmanager.com',
      'https://*.vercel.app',
      'https://ui-avatars.com',
      'https://cdn.prod.website-files.com',
      'https://*.cloudinary.com'
    ],
    fontSrc: [
      "'self'",
      'data:',
      'https://fonts.gstatic.com',
      'https://*.vercel.app'
    ],
    connectSrc: [
      "'self'",
      'https://*.google-analytics.com',
      'https://*.analytics.google.com',
      'https://*.vercel-insights.com',
      'https://jcic.vercel.app',
      'https://*.vercel.app',
      'wss://*.vercel.app'
    ],
    frameSrc: ["'self'"],
    mediaSrc: ["'self'"],
    manifestSrc: ["'self'"],
    objectSrc: ["'none'"],
    baseUri: ["'self'"],
    formAction: ["'self'"],
    workerSrc: ["'self'", 'blob:'],
    childSrc: ["'self'"],
    upgradeInsecureRequests: true,
    blockAllMixedContent: true
  }
};

const developmentConfig: SecurityHeadersConfig = {
  ...productionConfig,
  csp: {
    ...productionConfig.csp,
    connectSrc: [
      ...((productionConfig.csp && productionConfig.csp.connectSrc) || ["'self'"]),
      // dev additions for hot reload / local APIs
      "ws://localhost:*",
      "http://localhost:*",
      "http://192.168.0.159:*",
      "ws://192.168.0.159:*"
    ],
    // disable upgradeInsecureRequests in dev to avoid breaking local http
    upgradeInsecureRequests: false
  }
};

/**
 * withSecurityHeaders
 *
 * Usage:
 *  const response = await withSecurityHeaders(request);
 *  // or pass overrides: await withSecurityHeaders(request, { reportOnly: true })
 */
export async function withSecurityHeaders(
  request: NextRequest,
  userConfig: Partial<SecurityHeadersConfig> = {}
) {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const baseConfig = isDevelopment ? developmentConfig : productionConfig;
  const config: SecurityHeadersConfig = { ...baseConfig, ...userConfig };

  const response = NextResponse.next();

  // NOTE: We do NOT generate/apply a nonce by default here.
  // If you want a nonce-based flow, see the commented "nonce approach" below.

  // Standard security headers
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

  // Build CSP string
  if (config.csp) {
    const directives: string[] = [];

    const push = (name: string, sources?: (string | boolean)[]) => {
      if (!sources || sources.length === 0) return;
      // Map boolean true/false (for flags like upgrade-insecure-requests) out of sources
      const parts: string[] = [];
      for (const s of sources) {
        if (typeof s === 'string') {
          parts.push(s);
        }
      }
      if (parts.length > 0) {
        directives.push(`${name} ${parts.join(' ')}`);
      }
    };

    // Core groups - add only when present
    push('default-src', config.csp.defaultSrc);
    push('script-src', config.csp.scriptSrc);
    push('style-src', config.csp.styleSrc);
    push('img-src', config.csp.imgSrc);
    push('font-src', config.csp.fontSrc);
    push('connect-src', config.csp.connectSrc);
    push('frame-src', config.csp.frameSrc);
    push('object-src', config.csp.objectSrc);
    push('base-uri', config.csp.baseUri);
    push('form-action', config.csp.formAction);
    push('worker-src', config.csp.workerSrc);
    push('media-src', config.csp.mediaSrc);
    push('manifest-src', config.csp.manifestSrc);
    push('child-src', config.csp.childSrc);

    // Flags / single-token directives
    if (config.csp.upgradeInsecureRequests) {
      directives.push('upgrade-insecure-requests');
    }
    if (config.csp.blockAllMixedContent) {
      directives.push('block-all-mixed-content');
    }
    // report-uri (if present)
    if (config.csp.reportUri) {
      directives.push(`report-uri ${config.csp.reportUri}`);
    }

    const cspHeaderName = config.reportOnly ? 'Content-Security-Policy-Report-Only' : 'Content-Security-Policy';
    response.headers.set(cspHeaderName, directives.join('; '));
  }

  if (isDevelopment) {
    // Helpful debug output in dev only
    // eslint-disable-next-line no-console
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

export const securityHeadersConfig: SecurityHeadersConfig = productionConfig;

/* =======================
   OPTIONAL: NONCE-BASED APPROACH (commented)
   =======================
   If you prefer to use nonces (which is more secure for inline scripts),
   you must:

   1) generate a nonce here (e.g. const nonce = crypto.randomUUID();)
   2) add 'nonce-<value>' to the script-src directive
   3) ensure every inline script and every <script> tag rendered by your app
      has the nonce attribute (e.g. <script nonce="{nonce}"> or <NextScript nonce={nonce} />)
   4) IMPORTANT: when using 'nonce-...' together with 'strict-dynamic', host allowlists
      are ignored. So do NOT include 'strict-dynamic' if you want host lists to apply.

   I left this out of the default flow because adding nonces requires you to
   modify your Document/_app to attach the nonce to all relevant script tags.
*/
