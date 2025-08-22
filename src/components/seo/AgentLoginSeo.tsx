// src/components/seo/AgentLoginSeo.tsx
"use client";

import Head from "next/head";

export default function AgentLoginSeo() {
  const title = "Agent Login - NIMC Partner Portal";
  const description =
    "Access your Jubilee Care agent dashboard. Login to manage NIN enrollments, verifications, and access NIMC partner resources.";
  const url = "https://jcic.vercel.app/agent/login";

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta
        name="keywords"
        content="agent login, NIMC partner login, NIN agent portal, Jubilee Care login, agent dashboard, NIMC FEP login"
      />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />

      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />

      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: title,
            description: description,
            url: url,
            breadcrumb: {
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: "https://jcic.vercel.app",
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Agent Login",
                  item: url,
                },
              ],
            },
          }),
        }}
      />
    </Head>
  );
}
