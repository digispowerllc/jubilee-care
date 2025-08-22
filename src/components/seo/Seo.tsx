"use client";

import Head from "next/head";
import Script from "next/script";

interface SeoProps {
  title: string;
  description: string;
  keywords?: string[];
  url?: string;
  image?: string;
  type?: "website" | "article" | "organization";
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
  locale?: string;
  siteName?: string;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
}

export default function Seo({
  title,
  description,
  keywords = [
    "NIMC",
    "National Identification Number",
    "NIN enrollment",
    "digital identity",
    "ICT training",
    "Nigeria",
    "Jubilee Care",
    "ICT consultancy",
    "digital verification",
    "identity management",
    "NIMC FEP",
    "Front-End Partner",
  ],
  url = "https://jcic.vercel.app",
  image = "/og-image.jpg", // Now relative path since it's in public folder
  type = "website",
  orgName = "Jubilee Care ICT Innovative Consult",
  logo = "/logo.png", // Relative path to public folder
  phone = "+2347039792389",
  email = "info@jubileecare.ng",
  address = {
    city: "Umuahia",
    region: "Abia State",
    country: "Nigeria",
  },
  sameAs = [
    "https://www.facebook.com/JCGNigeria",
    "https://www.instagram.com/JCGNigeria",
    "https://twitter.com/JCGNigeria",
    "https://wa.me/2347039792389",
  ],
  locale = "en_NG",
  siteName = "Jubilee Care ICT Innovative Consult",
  publishedTime,
  modifiedTime,
  author,
}: SeoProps) {
  // Construct full title with site name
  const fullTitle = `${title} | ${siteName}`;

  // Construct full URLs for assets in public folder
  const baseUrl = "https://jcic.vercel.app";
  const fullImageUrl = image.startsWith("http") ? image : `${baseUrl}${image}`;
  const fullLogoUrl = logo.startsWith("http") ? logo : `${baseUrl}${logo}`;

  // Organization JSON-LD
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: orgName,
    url: url,
    logo: fullLogoUrl,
    description: description,
    ...(phone && {
      contactPoint: {
        "@type": "ContactPoint",
        telephone: phone,
        contactType: "customer service",
        ...(email && { email: email }),
      },
    }),
    ...(address && {
      address: {
        "@type": "PostalAddress",
        addressLocality: address.city,
        addressRegion: address.region,
        addressCountry: address.country,
        ...(address.street && { streetAddress: address.street }),
        ...(address.postalCode && { postalCode: address.postalCode }),
      },
    }),
    sameAs: sameAs,
  };

  // Article JSON-LD (if type is article)
  const articleJsonLd =
    type === "article"
      ? {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: title,
          description: description,
          image: fullImageUrl,
          datePublished: publishedTime,
          dateModified: modifiedTime || publishedTime,
          author: author
            ? {
                "@type": "Person",
                name: author,
              }
            : undefined,
          publisher: {
            "@type": "Organization",
            name: orgName,
            logo: {
              "@type": "ImageObject",
              url: fullLogoUrl,
            },
          },
        }
      : null;

  return (
    <>
      <Head>
        {/* Primary Meta Tags */}
        <title>{fullTitle}</title>
        <meta name="title" content={fullTitle} />
        <meta name="description" content={description} />
        {keywords.length > 0 && (
          <meta name="keywords" content={keywords.join(", ")} />
        )}
        <link rel="canonical" href={url} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content={type} />
        <meta property="og:url" content={url} />
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={fullImageUrl} />
        <meta property="og:site_name" content={siteName} />
        <meta property="og:locale" content={locale} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={fullTitle} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={fullImageUrl} />
        <meta name="twitter:site" content="@JCGNigeria" />

        {/* Additional Meta Tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#16A34A" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content={orgName} />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />

        {/* Article-specific meta tags */}
        {type === "article" && publishedTime && (
          <meta property="article:published_time" content={publishedTime} />
        )}
        {type === "article" && modifiedTime && (
          <meta property="article:modified_time" content={modifiedTime} />
        )}
        {type === "article" && author && (
          <meta property="article:author" content={author} />
        )}
      </Head>

      {/* Organization Schema */}
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />

      {/* Article Schema (if applicable) */}
      {type === "article" && articleJsonLd && (
        <Script
          id="article-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
        />
      )}

      {/* Additional verification tags can be added here */}
      {/* <meta name="google-site-verification" content="your-verification-code" /> */}
      {/* <meta name="facebook-domain-verification" content="your-verification-code" /> */}
    </>
  );
}
