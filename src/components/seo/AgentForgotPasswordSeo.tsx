// src/components/seo/AgentForgotPasswordSeo.tsx
"use client";

import Head from "next/head";

export default function AgentForgotPasswordSeo() {
  const title = "Reset Agent Password - Jubilee Care Portal";
  const description = "Reset your Jubilee Care agent account password. Regain access to your NIMC partner dashboard and continue providing NIN services.";
  const url = "https://jcic.vercel.app/agent/forgot-password";
  
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content="password reset, agent account recovery, forgot password, NIMC portal access, password recovery, agent support" />
      
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />

      {/* No-index for password pages */}
      <meta name="robots" content="noindex, nofollow" />

      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": title,
            "description": description,
            "url": url,
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://jcic.vercel.app"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Agent Login",
                  "item": "https://jcic.vercel.app/agent/signin"
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "name": "Password Reset",
                  "item": url
                }
              ]
            }
          })
        }}
      />
    </Head>
  );
}