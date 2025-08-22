// src/components/seo/GlobalSeo.tsx
"use client";

import Head from "next/head";
import Script from "next/script";

interface GlobalSeoProps {
  title?: string;
  description?: string;
}

export default function GlobalSeo({
  title = "Jubilee Care ICT Innovations and Consult",
  description = "Official NIMC Front-End Partner providing secure NIN enrollment, verification, and ICT solutions across Nigeria",
}: GlobalSeoProps) {
  const baseUrl = "https://jcic.vercel.app";
  const fullTitle = `${title} | Jubilee Care ICT Innovative Consult`;

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Jubilee Care ICT Innovative Consult",
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description: description,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+2347039792389",
      email: "info@jubileecare.ng",
      contactType: "customer service",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Umuahia",
      addressRegion: "Abia State",
      addressCountry: "Nigeria",
    },
    sameAs: [
      "https://www.facebook.com/JCGNigeria",
      "https://www.instagram.com/JCGNigeria",
      "https://twitter.com/JCGNigeria",
      "https://wa.me/2347039792389",
    ],
  };

  return (
    <>
      <Head>
        {/* Global Meta Tags */}
        <title>{fullTitle}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={baseUrl} />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={baseUrl} />
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={`${baseUrl}/og-image.jpg`} />
        <meta
          property="og:site_name"
          content="Jubilee Care ICT Innovative Consult"
        />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={fullTitle} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={`${baseUrl}/og-image.jpg`} />

        {/* Additional */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#16A34A" />
        <meta name="robots" content="index, follow" />
      </Head>

      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
    </>
  );
}
