"use client";

import Head from "next/head";
import Script from "next/script";

interface SeoProps {
  title: string;
  description: string;
  keywords?: string[];
  url?: string;
  image?: string;
  type?: "website" | "article";
  orgName?: string;
  logo?: string;
  phone?: string;
  email?: string;
  address?: {
    street?: string;
    city?: string;
    region?: string;
    postalCode?: string;
    country?: string;
  };
  sameAs?: string[];
}

export default function Seo({
  title,
  description,
  keywords = [],
  url = "https://jcic.vercel.app",
  image = "https://jcic.vercel.app/og-image.jpg",  // customize if you have an actual OG image
  type = "website",
  orgName = "JCIC",
  logo = "https://jcic.vercel.app/logo.png",        // customize if you have an actual logo
  phone,
  email,
  address,
  sameAs = [
    // update these if your agency uses social platforms
    "https://www.facebook.com/JCIC",
    "https://www.instagram.com/JCIC",
    "https://www.linkedin.com/company/JCIC"
  ]
}: SeoProps) {
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: orgName,
    url,
    logo,
    contactPoint: phone || email
      ? [
          {
            "@type": "ContactPoint",
            ...(phone && { telephone: phone }),
            ...(email && { email }),
            contactType: "customer support"
          }
        ]
      : undefined,
    ...(address && {
      address: {
        "@type": "PostalAddress",
        streetAddress: address.street,
        addressLocality: address.city,
        addressRegion: address.region,
        postalCode: address.postalCode,
        addressCountry: address.country
      }
    }),
    sameAs
  };

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        {keywords.length > 0 && <meta name="keywords" content={keywords.join(", ")} />}
        <link rel="canonical" href={url} />

        <meta property="og:type" content={type} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={image} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />
      </Head>

      <Script
        id="org-json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd, null, 2) }}
      />
    </>
  );
}
